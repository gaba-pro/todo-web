package controllers

import (
	"todoapp/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"net/http"
	"time"
)

var jwtKey = []byte("secret")

var users = map[string]models.User{
	"assigner": {"assigner", "12345678", "assigner"},
	"user1":    {"user1", "12345678", "user"},
	"user2":    {"user2", "12345678", "user"},
}

func LoginHandler(c *gin.Context) {
	var creds models.User
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	user, ok := users[creds.Username]
	if !ok || user.Password != creds.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	expirationTime := time.Now().Add(1 * time.Hour)
	claims := &models.Claims{
		Username: creds.Username,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString, "role": user.Role})
}

func GetAllUsers(c *gin.Context) {
	var allUsers []models.User
	for _, u := range users {
		allUsers = append(allUsers, models.User{Username: u.Username, Role: u.Role})
	}
	c.JSON(http.StatusOK, allUsers)
}
