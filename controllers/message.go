package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/laynefaler/chatroom/models"
	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

func CreateMessage(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	db := c.MustGet("db").(*gorm.DB)

	userId, _ := c.Cookie("current_user_id")
	id, _ := uuid.FromString(userId)

	var body models.Message
	c.BindJSON(&body)

	message := models.Message{
		UserID: id,
		Text:   body.Text,
	}

	db.Create(&message)

	c.JSON(http.StatusCreated, message)
}
