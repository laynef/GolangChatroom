package controllers

import (
	"net/http"
	"strconv"

	"github.com/dogukanayd/gorm-pagination/pagination"
	"github.com/gin-gonic/gin"
	"github.com/laynefaler/chatroom/models"
	"gorm.io/gorm"
)

func ListThreads(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))

	var threads []models.Thread
	p, _ := (&pagination.Config{
		Page:    page,
		PerPage: perPage,
		Path:    c.Request.URL.Path,
		Sort:    "id desc",
	}).Paginate(db, &threads)

	c.JSON(http.StatusOK, p)
}

func ShowThread(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{"hello": "world"})
}

func CreateThread(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{"hello": "world"})
}

func UpdateThread(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{"hello": "world"})
}

func DestroyThread(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{"hello": "world"})
}
