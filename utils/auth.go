package utils

import "github.com/gin-gonic/gin"

const JwtExpiresAt int64 = 15000
const JwtCookieExpiresAt int = 15000

func ClearCookies(c *gin.Context) {
	c.SetCookie("jwt", "", -1, "/", c.Request.URL.Host, false, false)
	c.SetCookie("current_user_id", "", -1, "/", c.Request.URL.Host, false, false)
}

func CreateCookie(name string, value string, c *gin.Context) {
	c.SetCookie(name, value, JwtCookieExpiresAt, "/", c.Request.URL.Host, false, false)
}
