package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/laynefaler/chatroom/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Login(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{"hello": "world"})
}

func SignUp(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(gorm.DB)

	var body models.User
	c.BindJSON(&body)

	if body.Password != body.PasswordConfirmation {
		c.JSON(http.StatusPartialContent, gin.H{
			"message": "passwords must match",
		})
		return
	}

	pass := []byte(body.Password)
	hash, _ := bcrypt.GenerateFromPassword(pass, 10)

	user := models.User{
		Email:        body.Email,
		PasswordHash: string(hash),
	}

	db.Create(&user)

	c.JSON(http.StatusOK, gin.H{
		"id":         user.ID,
		"email":      user.Email,
		"created_at": user.CreatedAt,
	})
}

func ForgottenPassword(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{"hello": "world"})
}

func ChangePassword(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{"hello": "world"})
}
