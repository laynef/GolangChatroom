package utils

import (
	"fmt"
	"os"
	"path/filepath"
)

func FindFile(extension string) string {
	f, err := os.Open("./public/assets/")
	if err != nil {
		fmt.Println(err)
		return ""
	}
	files, err := f.Readdir(0)
	if err != nil {
		fmt.Println(err)
		return ""
	}

	for _, v := range files {
		fileExtension := filepath.Ext(v.Name())
		if extension == fileExtension {
			return "/public/assets/" + v.Name()
		}
	}

	return ""
}
