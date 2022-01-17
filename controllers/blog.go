package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/laynefaler/chatroom/models"
	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

func ListBlogs(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))

	var blogs []models.Blog
	p, _ := (&models.Config{
		Page:    page,
		PerPage: perPage,
		Path:    c.Request.URL.Path,
		Sort:    "created_at desc",
	}).Paginate(db, &blogs)

	c.JSON(http.StatusOK, p)
}

func ShowBlog(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	blogId, _ := c.Params.Get("blogId")
	id, _ := uuid.FromString(blogId)

	var blog models.Blog
	db.Preload("User").First(&blog, id)

	c.JSON(http.StatusOK, blog)
}

func CreateBlog(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	userId, _ := c.Cookie("current_user_id")

	var body models.Blog
	c.BindJSON(&body)

	id, _ := uuid.FromString(userId)

	blog := models.Blog{
		Title:    body.Title,
		Text:     body.Text,
		ImageUrl: body.ImageUrl,
		UserID:   id,
	}

	db.Create(&blog)

	c.JSON(http.StatusCreated, blog)
}

func UpdateBlog(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	var body models.Blog
	c.BindJSON(&body)

	blogId, _ := c.Params.Get("blogId")
	blog := db.First(blogId)
	db.Model(&blog).Update("title", body.Title).Update("image_url", body.ImageUrl).Update("text", body.Text)

	c.JSON(http.StatusOK, blog)
}

func DestroyBlog(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	blogId, _ := c.Params.Get("blogId")
	db.Delete(&models.Blog{}, blogId)

	c.JSON(http.StatusNoContent, nil)
}
