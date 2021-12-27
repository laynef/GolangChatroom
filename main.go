package main

import (
	"github.com/laynefaler/chatroom/controllers"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/", controllers.Home)
	r.Run()
}