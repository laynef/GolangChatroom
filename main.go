package main

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/laynefaler/chatroom/controllers"
	"github.com/laynefaler/chatroom/models"
)

func findFile(extension string) string {
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

func main() {
	r := gin.Default()

	// Load views
	r.LoadHTMLGlob("views/*.html")

	// connect to database
	db := models.SetupModels()

	// Provide db variable to controllers
	r.Use(func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	})

	// Define routes
	v1 := r.Group("/api/v1")
	v1.GET("/", controllers.Home)

	// Serve public assets
	r.Use(static.Serve("/public", static.LocalFile("./public", true)))

	// Return html for all other routes
	// The browser controls the HTML routing
	r.NoRoute(func(c *gin.Context) {
		script := findFile(".js")
		stylesheet := findFile(".css")

		c.HTML(http.StatusOK, "index.html", gin.H{
			"script":     script,
			"stylesheet": stylesheet,
		})
	})

	r.Run()
}
