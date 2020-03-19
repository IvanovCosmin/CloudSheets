/*Takes the path to a file A and the path to a folder B . Splits A into multiple 16M files that are stored in a folder inside B*/

#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
//#include <windows.h>
#include <direct.h>
//#include <fileapi.h>
#include "sha256.h"

#define chunkDimension 16777216  

using namespace std;
void bzero(char sir[]) {
	for (int i = 0; i < strlen(sir); i++) sir[i] = 0;
}
char* getFileName(char* dir) {
	char* nume = (char*) malloc(128);
	for (int i = 0; i < 128; i++) nume[i] = 0;
	int i, flag = 1;
	for (i = strlen(dir)-1; i >0 && flag; i--) {
		if (dir[i] == 92 ) flag = 0; 
	}
	strcat(nume, dir + i + 2);
	//printf("%s\n", nume);
	return nume;
}

char* getFileExtension(char* fileName) {
	char* extension = (char*)malloc(12);
	bzero(extension);
	int i, flag = 1;
	for (i = strlen(fileName) - 1; i > 0 && flag; i--) {
		if (fileName[i] == '.') flag = 0;
	}
	if (flag == 0) {
		strcat(extension, fileName+i+1);
	}
	return extension;
}

char* getFileDirNoExtension(char* fileName) {
	char* nume = (char*)malloc(128);
	bzero(nume);
	for (int i = 0; i < 128; i++) nume[i] = 0;
	int i, flag = 1;
	for (i = strlen(fileName) - 1; i > 0 && flag; i--) {
		if (fileName[i] == '.') flag = 0;
	}
	if (flag == 0) {
		strncat(nume, fileName, i + 1);
	}
	else(strcat(nume, fileName));
	//printf("%s\n", nume);
	return nume;
}


int getSizeInBytes(FILE *file) {
	fseek(file, 0, SEEK_END);
	int size = ftell(file);
	fseek(file, 0, SEEK_SET);
	//printf("%d\n", ftell(file));
	return size;
}



char* createFileDirName(char *dir,char *name,int number) {
	char* nr=(char*) malloc(128);
	char* nume = (char*)malloc(256);
	bzero(nume);
	strcat(nume,dir);

	char backslash[2];
	bzero(backslash);
	backslash[0] = 92;
	backslash[1] = 0;
	sprintf(nr,"%d",number);
	strcat(nume, backslash);
	strcat(nume,getFileDirNoExtension(name));
	strcat(nume, backslash);
	strcat(nume, getFileDirNoExtension(name));
	strcat(nume, "_");
	strcat(nume, nr);
	//printf("%s\n", nume);
	delete(nr);
	return nume;
}

void createDir(char *dir,char* numeFisier) {
	_mkdir(dir);
	char *aux = (char*) malloc(128);
	bzero(aux);
	strcat(aux, dir);
	strcat(aux, "\\");
	strcat(aux, getFileDirNoExtension(numeFisier));
	const char* fisierFinal = aux;
	//printf("%s\n", fisierFinal);
	printf("%d\n", _mkdir(fisierFinal));
	delete(aux);
	//delete(fisierFinal);
}

char* getDetailsDir(char* dir,char* numeFisier) {
	char* caleFinala = (char*)malloc(128);
	bzero(caleFinala);
	strcat(caleFinala,dir);
	strcat(caleFinala, "\\");
	strcat(caleFinala,getFileDirNoExtension(numeFisier));
	
	strcat(caleFinala, "\\");
	strcat(caleFinala, "detali.txt");
	return caleFinala;
}



int main(int argc,char* argv[]) {
	FILE *inFile;
	FILE *outFile;
	FILE *detali;
	char bitList[4096];
	char* numeFisier;
	char* caleFinala = (char*)malloc(128);
	int flag;
	int size ;


	if (argc != 3) {
		printf("Not enough arguments\n");
		system("pause");
		exit(1);
	}
	
	inFile = fopen(argv[1], "rb");

	
	
	if(inFile){
		
		size = getSizeInBytes(inFile);
		numeFisier = getFileName(argv[1]);
		createDir(argv[2],numeFisier);

		
		int nrFisiere = size / chunkDimension;
		int newFileSize = 0;
		float nrFisiereReal = float(size) / chunkDimension;
		if (nrFisiereReal != nrFisiere) {
			nrFisiere++;
		}
		printf("%s\n", getDetailsDir(argv[2], numeFisier));
		printf("%s\n", getDetailsDir(argv[2], numeFisier));
		detali = fopen(getDetailsDir(argv[2],numeFisier), "w");
		if (detali == NULL) {
			// Error, as expected.
			perror("Error opening file");
			printf("Error code opening file: %d\n", errno);
			printf("Error opening file: %s\n", strerror(errno));
			exit(-1);
		}
		fprintf(detali,"%d\n",nrFisiere);
		fprintf(detali, "%s\n", getFileExtension(numeFisier));



		int wholeSize = 0;
		int i = 1;
		SHA256_CTX mexicana;
		unsigned char hash[64];
		while (!feof(inFile)) {
			//printf("%s\n", createFileDirName(argv[2], numeFisier, i));
			//printf("%s\n",getFileName(createFileDirName(argv[2],numeFisier, i)));
			sha256_init(&mexicana);
			sha256_update(&mexicana,(const unsigned char*)getFileName(createFileDirName(argv[2],numeFisier, i)),strlen(getFileName(createFileDirName(argv[2],numeFisier, i))) );
			bzero((char*)hash);
			sha256_final(&mexicana,hash);
			printf("%s\n\n\n",hash);
			outFile = fopen(createFileDirName(argv[2],numeFisier, i), "wb");
			if (outFile) {
				//printf("DASDA\n");
				fprintf(detali, "%s\n", createFileDirName(argv[2],numeFisier, i));
				size = 0;
				while (size + 4096 <= chunkDimension && !feof(inFile)) {
					bzero(bitList);
					fread(&bitList, 4096, 1, inFile);
					fwrite(&bitList, 4096, 1, outFile);
					size += 4096;
					wholeSize += 4096;
				}
				if (size < chunkDimension) {
					bzero(bitList);
					fread(&bitList, chunkDimension - size, 1, inFile);
					fwrite(&bitList, chunkDimension - size, 1, outFile);
				}
				fclose(outFile);
			}
			
			i++;
		}




//		fclose(detali);
		delete(numeFisier);
	}

	
	fclose(inFile);
	system("pause");
}