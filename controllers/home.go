package controllers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func Home(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{"hello": "world"})
}
