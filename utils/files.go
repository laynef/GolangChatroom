package utils

import (
	"fmt"
	"os"
	"path/filepath"
)

func FindFile(extension string) (string, error) {
	f, err := os.Open("./public/assets/")
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	files, errors := f.Readdir(0)
	if errors != nil {
		fmt.Println(errors)
		return "", errors
	}

	for _, v := range files {
		fileExtension := filepath.Ext(v.Name())
		if extension == fileExtension {
			return "/public/assets/" + v.Name(), nil
		}
	}

	return "", fmt.Errorf("no files found")
}
