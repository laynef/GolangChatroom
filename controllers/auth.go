package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{"hello": "world"})
}

func SignUp(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{"hello": "world"})
}

func ForgottenPassword(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{"hello": "world"})
}

func ChangePassword(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{"hello": "world"})
}
