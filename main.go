package main

import (
	"github.com/gin-gonic/gin"
	"github.com/laynefaler/chatroom/controllers"
)

func main() {
	r := gin.Default()

	// Define routes
	r.GET("/", controllers.Home)

	r.Run()
}
