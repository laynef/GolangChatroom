package models

import (
	"time"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type User struct {
	ID                   uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey;"`
	Email                string         `json:"email" validate:"required,email" gorm:"unique"`
	Username             string         `json:"username" validate:"required,min=2,max=20" gorm:"unique"`
	Password             string         `json:"password" gorm:"-"`
	PasswordConfirmation string         `json:"password_confirmation" gorm:"-"`
	PasswordHash         string         `json:"-"`
	CreatedAt            time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt            time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt            gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

func (u *User) BeforeCreate(scope *gorm.DB) (err error) {
	uuid := uuid.NewV4()
	u.ID = uuid
	return
}
