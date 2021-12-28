package middleware

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/laynefaler/chatroom/utils"
)

func Authorize(c *gin.Context) {
	tokenString, _ := c.Cookie("jwt")
	userId, _ := c.Cookie("current_user_id")

	at(time.Unix(0, 0), func() {
		token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(utils.GetWebSecret()), nil
		})

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "jwt parsing error",
			})
			return
		}

		if claims, ok := token.Claims.(*jwt.StandardClaims); ok && token.Valid {
			if claims.Id != userId {
				c.JSON(http.StatusUnauthorized, gin.H{
					"message": "wrong user",
				})
				return
			}
		} else {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "invalid token",
			})
			return
		}
	})

	c.Next()
}

func at(t time.Time, f func()) {
	jwt.TimeFunc = func() time.Time {
		return t
	}
	f()
	jwt.TimeFunc = time.Now
}
