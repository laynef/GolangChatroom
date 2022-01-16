package models

import (
	"time"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Blog struct {
	gorm.Model
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey;"`
	Title     string         `json:"title" gorm:"title"`
	ImageUrl  string         `json:"image_url" gorm:"image_url"`
	Text      string         `json:"text" gorm:"text"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
	UserID    uuid.UUID
	User      User
}

func (m *Blog) BeforeCreate(scope *gorm.DB) (err error) {
	uuid := uuid.NewV4()
	m.ID = uuid
	return
}
