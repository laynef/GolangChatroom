package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID                   uint    `gorm:"primaryKey"`
	Email                *string `gorm:"unique"`
	Password             string  `gorm:"-"`
	PasswordConfirmation string  `gorm:"-"`
	PasswordHash         string
	CreatedAt            time.Time
	UpdatedAt            time.Time      `gorm:"autoUpdateTime"`
	DeletedAt            gorm.DeletedAt `gorm:"index"`
}
