package utils

import "github.com/gin-gonic/gin"

const JwtExpiresAt int64 = 15000
const JwtCookieExpiresAt int = 15000

func ClearAuthCookies(c *gin.Context) {
	c.SetCookie("jwt", "", -1, "/", c.Request.URL.Hostname(), false, false)
	c.SetCookie("current_user_id", "", -1, "/", c.Request.URL.Hostname(), false, false)
}

func CreateCookie(name string, value string, c *gin.Context) {
	c.SetCookie(name, value, JwtCookieExpiresAt, "/", c.Request.URL.Hostname(), false, false)
}
