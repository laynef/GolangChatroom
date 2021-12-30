package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"
	"github.com/laynefaler/chatroom/controllers"
	"github.com/laynefaler/chatroom/middleware"
	"github.com/laynefaler/chatroom/models"
	"github.com/laynefaler/chatroom/utils"
)

func main() {
	r := gin.Default()
	db := models.SetupModels()
	io := socketio.NewServer(nil)

	io.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("connected:", s.ID())
		return nil
	})

	io.OnEvent("/", "notice", func(s socketio.Conn, msg string) {
		log.Println("notice:", msg)
		s.Emit("reply", "have "+msg)
	})

	io.OnEvent("/chat", "msg", func(s socketio.Conn, msg string) string {
		s.SetContext(msg)
		return "recv " + msg
	})

	io.OnEvent("/", "bye", func(s socketio.Conn) string {
		last := s.Context().(string)
		s.Emit("bye", last)
		s.Close()
		return last
	})

	io.OnError("/", func(s socketio.Conn, e error) {
		fmt.Println("meet error:", e)
	})

	io.OnDisconnect("/", func(s socketio.Conn, reason string) {
		fmt.Println("closed", reason)
	})

	go io.Serve()
	defer io.Close()

	// Load views
	r.LoadHTMLGlob("views/*.html")

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

	// Authentication routes
	v1.POST("/auth/login", controllers.Login)
	v1.POST("/auth/signup", controllers.SignUp)

	// Authorized routes
	auth := r.Group("/api/v1")
	auth.Use(middleware.Authorize)
	auth.DELETE("/auth/logout", controllers.Logout)
	// Authorized threads
	auth.GET("/threads", controllers.ListThreads)
	auth.GET("/threads/:threadId", controllers.ShowThread)
	auth.POST("/threads", controllers.CreateThread)
	auth.PUT("/threads/:threadId", controllers.UpdateThread)
	auth.DELETE("/threads/:threadId", controllers.DestroyThread)
	// Authorized Messages
	auth.POST("/threads/:threadId/messages", controllers.CreateMessage)
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

	r.GET("/socket.io/*any", gin.WrapH(io))
	r.POST("/socket.io/*any", gin.WrapH(io))

	r.Run()
}
