package models

import (
	"time"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Thread struct {
	gorm.Model
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey;"`
	Name      string         `json:"name" validate:"required,min=2,max=20" gorm:"unique"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
	Messages  []Message
	UserID    uuid.UUID
}

func (t *Thread) BeforeCreate(scope *gorm.DB) (err error) {
	uuid := uuid.NewV4()
	t.ID = uuid
	return
}
