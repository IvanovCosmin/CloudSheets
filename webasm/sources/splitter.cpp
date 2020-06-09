#include <stdio.h>
#include <cstdio>
#include "sha256.h"
#include <fstream>
#include <sstream>
#include <string>

#include <emscripten/emscripten.h>

int main() {
    printf("Webassembly loaded and ready to go!!!\n");
    return 0;
}

#define SIZE_1_MB 1000000

#ifdef __cplusplus
extern "C" {
#endif

struct FileHeader {
    unsigned char hash[32];
    unsigned int originalFileSize;
    unsigned int currentFileSize;
};



void EMSCRIPTEN_KEEPALIVE myFunction(int argc, char ** argv) {
    printf("MyFunction Called\n");
}

unsigned int EMSCRIPTEN_KEEPALIVE readFile(int argc, char ** argv) {
    FILE * hFile = fopen("fileinput", "rb");
    FILE * hMetadata = fopen("metadata", "a");
    unsigned int sz = 0;
    if(hFile) {
        printf("Am tras fisierul\nCitesc:\n");
        char buff[SIZE_1_MB];
        unsigned int readSize = 0;
        while(!feof(hFile)) {
            readSize = fread(buff, 1, SIZE_1_MB, hFile);
            printf("read size: %d\n", readSize);
            // for(size_t i = 0; i < readSize; i++) {
            //     printf("%c", buff[i]);
            // }
        }
        printf("\nAm termiant de citit fisierul\n");
        fseek(hFile, 0, SEEK_END);
        sz = ftell(hFile);
        fclose(hFile);
        std::stringstream ss;
        ss << sz;
        std::string buffer;

        ss >> buffer;
        fwrite(buffer.c_str(), 1, buffer.length(), hMetadata);
        fwrite("\n", 1, 1, hMetadata);
        fclose(hMetadata);
        return sz/SIZE_1_MB + 1 - (sz % SIZE_1_MB == 0);
    }
    return 0;

}

void EMSCRIPTEN_KEEPALIVE showMetadata() {
    FILE * hMetadata = fopen("metadata", "r");
    if(hMetadata) {
        printf("Am tras fisierul de metadata\nCitesc:\n");
        char buff[SIZE_1_MB];
        unsigned int readSize = 0;
        while(!feof(hMetadata)) {
            readSize = fread(buff, 1, SIZE_1_MB, hMetadata);
            printf("read size: %d\n", readSize);
            for(size_t i = 0; i < readSize; i++) {
                printf("%c", buff[i]);
            }
        }
        printf("\nAm termiant de citit fisierul metadata\n");
        fclose(hMetadata);
    }
}

bool EMSCRIPTEN_KEEPALIVE generateNthSplitFile(int nrOfFileToProcess) {
    if(nrOfFileToProcess == 0) return false;
    FILE * hFile = fopen("fileinput", "rb");
    FILE * hMetadata = fopen("metadata", "a");
    printf("File handle: %X\n", (unsigned int) hFile);
    if(hFile) {
        printf("Am gasit fisierul\n");
        
        fseek(hFile, 0, SEEK_END);
        int sz = ftell(hFile);

        printf("Size of old file: %d\n", sz);
        
        if((nrOfFileToProcess - 1) * SIZE_1_MB > sz) return false;
        
        unsigned char buff[SIZE_1_MB];
        fseek(hFile, (nrOfFileToProcess - 1) * SIZE_1_MB , SEEK_SET);

        int bytesRead = fread(buff, 1, SIZE_1_MB, hFile);
        printf("Bytes read: %d\n", bytesRead);
        if(bytesRead == 0) return false;

        SHA256_CTX shaContext;
        sha256_init(&shaContext);
        sha256_update(&shaContext, buff, (size_t)bytesRead);
        
        unsigned char hash[32];
        sha256_final(&shaContext, hash);

        char str[65];

        unsigned char * pin = hash;
        const char * hex = "0123456789ABCDEF";
        char * pout = str;
        int i = 0;
        for(; i < sizeof(hash)-1; ++i){
            *pout++ = hex[(*pin>>4)&0xF];
            *pout++ = hex[(*pin++)&0xF];
        }
        *pout++ = hex[(*pin>>4)&0xF];
        *pout++ = hex[(*pin)&0xF];
        *pout++ = '.';
        *pout++ = 'c';
        *pout++ = 's';
        *pout++ = 'h';
        *pout++ = 't';

        *pout = NULL;

        printf("new file: %s\n", str);

        FILE * newFile = fopen(str, "w");
        FileHeader fheader;
        memcpy(fheader.hash, hash, 32);
        fheader.originalFileSize = sz;
        fheader.currentFileSize = bytesRead;
        fwrite(&fheader, sizeof(FileHeader), 1, newFile);

        fwrite(buff, 1, fheader.currentFileSize, newFile);
                
        fclose(newFile);
        
        fwrite(str, 1, strlen(str), hMetadata);
        fwrite(" ", 1, 1, hMetadata);
        
        std::stringstream ss;
        ss << nrOfFileToProcess;
        std::string buffer;

        ss >> buffer;

        fwrite(buffer.c_str(), 1, buffer.length() , hMetadata);
        fwrite("\n", 1, 1, hMetadata);

        fclose(hMetadata);
        
        printf("\nAm termiant de citit fisierul si de scris noul fisier\n");
        fclose(hFile);
        return true;
    }
    return false;

}

#ifdef __cplusplus
}
#endif
