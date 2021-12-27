package main

import (
	"net/http"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/laynefaler/chatroom/controllers"
	"github.com/laynefaler/chatroom/models"
)

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
		c.HTML(http.StatusOK, "index.html", nil)
	})

	r.Run()
}
