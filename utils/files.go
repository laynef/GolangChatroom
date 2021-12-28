package utils

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

func FindFile(extension string) string {
	dirpath := "/public/assets/"
	notFound := dirpath + "application" + extension

	f, err := os.Open("." + dirpath)
	if err != nil {
		fmt.Println(err.Error())
		return notFound
	}
	files, err := f.Readdir(0)
	if err != nil {
		fmt.Println(err.Error())
		return notFound
	}

	for _, v := range files {
		fileExtension := filepath.Ext(v.Name())
		if extension == fileExtension {
			return dirpath + v.Name()
		}
	}

	return notFound
}

func GetWebSecret() string {
	errors := godotenv.Load()
	if errors != nil {
		panic("Error loading .env file")
	}

	return os.Getenv("WEB_SECRET")
}
