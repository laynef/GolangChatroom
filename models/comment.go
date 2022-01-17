package models

import (
	"time"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Comment struct {
	gorm.Model
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey;"`
	Text      string         `json:"text" gorm:"text"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
	UserID    uuid.UUID
	BlogID    uuid.UUID
	User      User
	Blog      Blog
}

func (m *Comment) BeforeCreate(scope *gorm.DB) (err error) {
	uuid := uuid.NewV4()
	m.ID = uuid
	return
}
