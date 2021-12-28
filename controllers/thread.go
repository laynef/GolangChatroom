package controllers

import (
	"net/http"
	"strconv"

	"github.com/dogukanayd/gorm-pagination/pagination"
	"github.com/gin-gonic/gin"
	"github.com/laynefaler/chatroom/models"
	uuid "github.com/satori/go.uuid"
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
		Sort:    "created_at desc",
	}).Paginate(db, &threads)

	c.JSON(http.StatusOK, p)
}

func ShowThread(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	threadId, _ := c.Params.Get("thread_id")
	var thread models.Thread
	var messages []models.Message

	db.First(&thread, threadId)
	db.Model(&thread).Association("Messages").Find(&messages)

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))

	p, _ := (&pagination.Config{
		Page:    page,
		PerPage: perPage,
		Path:    c.Request.URL.Path,
		Sort:    "created_at desc",
	}).Paginate(db, &messages)

	c.JSON(http.StatusOK, p)
}

func CreateThread(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	userId, _ := c.Cookie("current_user_id")

	var body models.Thread
	c.BindJSON(&body)

	id, _ := uuid.FromString(userId)

	thread := models.Thread{
		Name:   body.Name,
		UserID: id,
	}

	db.Create(&thread)

	c.JSON(http.StatusCreated, thread)
}

func UpdateThread(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	var body models.Thread
	c.BindJSON(&body)

	threadId, _ := c.Params.Get("thread_id")
	thread := db.First(threadId)
	db.Model(&thread).Update("name", body.Name)

	c.JSON(http.StatusOK, thread)
}

func DestroyThread(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	threadId, _ := c.Params.Get("thread_id")
	db.Delete(&models.Thread{}, threadId)

	c.JSON(http.StatusNoContent, nil)
}
