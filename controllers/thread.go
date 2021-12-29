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

	threadId, _ := c.Params.Get("threadId")

	var thread models.Thread

	uid, _ := uuid.FromString(threadId)

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))

	p, _ := (&models.Config{
		Page:    page,
		PerPage: perPage,
		Path:    c.Request.URL.Path,
		Sort:    "created_at",
	}).Paginate(db, &thread, uid)

	showThread := models.ThreadShow{
		Messages: p,
		ID:       thread.ID,
		Name:     thread.Name,
		User:     thread.User,
	}

	c.JSON(http.StatusOK, showThread)
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

	threadId, _ := c.Params.Get("threadId")
	thread := db.First(threadId)
	db.Model(&thread).Update("name", body.Name)

	c.JSON(http.StatusOK, thread)
}

func DestroyThread(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	threadId, _ := c.Params.Get("threadId")
	db.Delete(&models.Thread{}, threadId)

	c.JSON(http.StatusNoContent, nil)
}
