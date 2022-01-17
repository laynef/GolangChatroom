package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/laynefaler/chatroom/models"
	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

func ListComments(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))

	blogId, _ := c.Params.Get("blogId")
	id, _ := uuid.FromString(blogId)

	var comments []models.Comment
	db.Model("Comment").Where("blog_id = ?", id).Find(&comments)

	p, _ := (&models.Config{
		Page:    page,
		PerPage: perPage,
		Path:    c.Request.URL.Path,
		Sort:    "created_at desc",
	}).Paginate(db, &comments)

	c.JSON(http.StatusOK, p)
}

func ShowComment(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	blogId, _ := c.Params.Get("blogId")
	id, _ := uuid.FromString(blogId)

	var blog models.Comment
	db.Preload("User").Preload("Comments").First(&blog, id)

	c.JSON(http.StatusOK, blog)
}

func CreateComment(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	userId, _ := c.Cookie("current_user_id")

	blogId, _ := c.Params.Get("blogId")
	uid, _ := uuid.FromString(blogId)

	var body models.Comment
	c.BindJSON(&body)

	id, _ := uuid.FromString(userId)

	blog := models.Comment{
		Text:   body.Text,
		UserID: id,
		BlogID: uid,
	}

	db.Create(&blog)

	c.JSON(http.StatusCreated, blog)
}

func UpdateComment(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	var body models.Comment
	c.BindJSON(&body)

	blogId, _ := c.Params.Get("blogId")
	blog := db.First(blogId)
	db.Model(&blog).Update("text", body.Text)

	c.JSON(http.StatusOK, blog)
}

func DestroyComment(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	blogId, _ := c.Params.Get("blogId")
	db.Delete(&models.Comment{}, blogId)

	c.JSON(http.StatusNoContent, nil)
}
