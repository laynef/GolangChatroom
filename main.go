package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/laynefaler/chatroom/controllers"
	"github.com/laynefaler/chatroom/middleware"
	"github.com/laynefaler/chatroom/models"
	"github.com/laynefaler/chatroom/utils"
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

	r.Use(cors.Default())
	r.SetTrustedProxies([]string{"127.0.0.1"})

	// Define routes
	v1 := r.Group("/api/v1")
	v1.GET("/", controllers.Home)

	// authentication routes
	v1.POST("/auth/login", controllers.Login)
	v1.POST("/auth/signup", controllers.SignUp)

	// authorized routes
	auth := r.Group("/api/v1")
	auth.Use(middleware.Authorize)
	auth.DELETE("/auth/logout", controllers.Logout)
	// Authorized threads
	auth.GET("/threads", controllers.ListThreads)
	auth.GET("/threads/{threadId}", controllers.ShowThread)
	auth.POST("/threads", controllers.CreateThread)
	auth.PUT("/threads/{threadId}", controllers.UpdateThread)
	auth.DELETE("/threads/{threadId}", controllers.DestroyThread)
	// Authorized Messages
	auth.POST("/messages", controllers.CreateMessage)
	// Serve public assets
	r.Use(static.Serve("/public", static.LocalFile("./public", true)))

	// Return html for all other routes
	// The browser controls the HTML routing
	r.NoRoute(func(c *gin.Context) {
		script := utils.FindFile(".js")
		stylesheet := utils.FindFile(".css")

		c.HTML(http.StatusOK, "index.html", gin.H{
			"script":     script,
			"stylesheet": stylesheet,
		})
	})

	r.Run()
}
