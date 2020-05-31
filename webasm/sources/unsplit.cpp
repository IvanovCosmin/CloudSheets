/*Ia ca argumente numele fisierului si pathul folderului B creat cu fisierul de split in care se gasesc chunckurile. Reconstruieste fisierul pe baza chunkurilor */

#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <windows.h>
#include <string>

#define chunkDimension 16777216 
using namespace std;
void bzero(char sir[]) {
	for (int i = 0; i < strlen(sir); i++) sir[i] = 0;
}

int getSizeInBytes(FILE *file) {
	fseek(file, 0, SEEK_END);
	int size = ftell(file);
	fseek(file, 0, SEEK_SET);
	return size;
}



int main(int argc, char* argv[]) {
	FILE* detali;
	FILE *inFile;
	FILE *outFile;
	char bitList[4096];
	char numeFisier[128];

	if (argc != 3) {
		printf("Not enough arguments\n");
		system("pause");
		exit(1);
	}
	char fileDir[256];
	bzero(fileDir);
	strcat(fileDir, argv[2]);
	strcat(fileDir,"\\");
	strcat(fileDir, argv[1]);
	strcat(fileDir, "\\detali.txt");
	detali=fopen(fileDir, "r");
	if (detali) {
		int nrFisiere;
		char nrFisiereChar[8] ;
		fgets(nrFisiereChar,8,detali);
		nrFisiere=atoi(nrFisiereChar);
		if (nrFisiere != 0) {
			char extension[12];
			bzero(extension);
			fgets(extension, 12, detali);
			extension[strlen(extension) - 1] = 0;
			char numeFisierFinal[128];
			bzero(numeFisierFinal);
			strcat(numeFisierFinal, argv[2]);
			strcat(numeFisierFinal, "\\");
			strcat(numeFisierFinal, argv[1]);
			strcat(numeFisierFinal, extension);
			outFile = fopen(numeFisierFinal,"wb");
			if (outFile) {
				for (int i = 1; i <= nrFisiere; i++) {
					bzero(numeFisier);
					fgets(numeFisier,128,detali);
					numeFisier[strlen(numeFisier)-1]=0;
					bzero(fileDir);

					//strcat(fileDir, argv[2]);
					//strcat(fileDir, "\\");
					strcat(fileDir, numeFisier);
					printf("%s\n", fileDir);
					inFile = fopen(fileDir, "rb");
					if (inFile) {
						int size = 0;
						if (getSizeInBytes(inFile) < 4096) {
							bzero(bitList);
							fread(&bitList, getSizeInBytes(inFile), 1, inFile);
							fwrite(&bitList, getSizeInBytes(inFile), 1, outFile);
						}
						else {
							while (size + 4096 <= chunkDimension && !feof(inFile)) {
								bzero(bitList);
								fread(&bitList, 4096, 1, inFile);
								fwrite(&bitList, 4096, 1, outFile);
								size += 4096;
							}

							if (size < chunkDimension) {
								bzero(bitList);
								fread(&bitList, chunkDimension - size, 1, inFile);
								fwrite(&bitList, chunkDimension, 1, outFile);
							}
						}
						fclose(inFile);
					}
				}
				fclose(outFile);
			}
		}
	}
	fclose(detali);
	system("pause");
}