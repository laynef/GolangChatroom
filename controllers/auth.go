package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt"
	"github.com/laynefaler/chatroom/models"
	"github.com/laynefaler/chatroom/utils"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Login(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	var body models.User
	c.BindJSON(&body)

	var user models.User
	db.First(&user, "email = ?", body.Email)
	hash := []byte(user.PasswordHash)
	pass := []byte(body.Password)

	err := bcrypt.CompareHashAndPassword(hash, pass)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "user not found",
			"code":    http.StatusNotFound,
		})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		ExpiresAt: 15000,
		Id:        fmt.Sprint(user.ID),
	})

	secret := []byte(utils.GetWebSecret())
	tokenString, err := token.SignedString(secret)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"code":    http.StatusPartialContent,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":    tokenString,
		"username": user.Username,
		"email":    user.Email,
	})
}

func SignUp(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	var body models.User
	c.BindJSON(&body)

	if body.Password != body.PasswordConfirmation {
		c.JSON(http.StatusPartialContent, gin.H{
			"message": "passwords must match",
			"code":    http.StatusPartialContent,
		})
		return
	}

	pass := []byte(body.Password)
	hash, _ := bcrypt.GenerateFromPassword(pass, 10)

	user := models.User{
		Email:        body.Email,
		Username:     body.Username,
		PasswordHash: string(hash),
	}

	v := validator.New()
	errors := v.Struct(user)

	if errors != nil {
		c.JSON(http.StatusPartialContent, gin.H{
			"message": errors.Error(),
			"code":    http.StatusPartialContent,
		})
		return
	}

	db.Create(&user)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		ExpiresAt: 15000,
		Id:        fmt.Sprint(user.ID),
	})

	secret := []byte(utils.GetWebSecret())
	tokenString, err := token.SignedString(secret)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"code":    http.StatusPartialContent,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":    tokenString,
		"username": user.Username,
		"email":    user.Email,
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

func Logout(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusNoContent, nil)
}
