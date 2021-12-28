package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID                   uint           `json:"id" gorm:"primaryKey"`
	Email                *string        `json:"email" gorm:"unique"`
	Password             string         `json:"password" gorm:"-"`
	PasswordConfirmation string         `json:"password_confirmation" gorm:"-"`
	PasswordHash         string         `json:"password_hash"`
	CreatedAt            time.Time      `json:"created_at"`
	UpdatedAt            time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt            gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}
