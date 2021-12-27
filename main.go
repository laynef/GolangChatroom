package main

import (
	"github.com/gin-gonic/gin"
	"github.com/laynefaler/chatroom/controllers"
	"github.com/laynefaler/chatroom/models"
)

func main() {
	r := gin.Default()

	// connect to database
	db := models.SetupModels()

	// Provide db variable to controllers
	r.Use(func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	})
	
	// Define routes
	r.GET("/", controllers.Home)

	r.Run()
}
