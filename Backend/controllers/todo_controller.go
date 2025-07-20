package controllers

import (
	"todoapp/config"
	"todoapp/models"
	
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetTodos(c *gin.Context) {
	rows, err := config.DB.Query("SELECT id, task, assign, status, deskripsi, dateline FROM todos")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching todos"})
		return
	}
	defer rows.Close()

	var todos []models.Todo
	for rows.Next() {
		var t models.Todo
		if err := rows.Scan(&t.ID, &t.Task, &t.Assign, &t.Status, &t.Deskripsi, &t.Dateline); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning todos"})
			return
		}
		todos = append(todos, t)
	}
	c.JSON(http.StatusOK, todos)
}

func CreateTodo(c *gin.Context) {
	var t models.Todo
	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	_, err := config.DB.Exec("INSERT INTO todos (task, assign, status, deskripsi, dateline) VALUES ($1, $2, $3, $4, $5)",
		t.Task, t.Assign, false, t.Deskripsi, t.Dateline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating todo"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Todo created"})
}

func UpdateTodo(c *gin.Context) {
	id := c.Param("id")
	var t models.Todo
	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	_, err := config.DB.Exec("UPDATE todos SET task=$1, assign=$2, deskripsi=$3, dateline=$4 WHERE id=$5",
		t.Task, t.Assign, t.Deskripsi, t.Dateline, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating todo"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Todo updated"})
}

func DeleteTodo(c *gin.Context) {
	id := c.Param("id")
	_, err := config.DB.Exec("DELETE FROM todos WHERE id=$1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting todo"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Todo deleted"})
}

func UpdateTodoStatus(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Status bool `json:"status"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	_, err := config.DB.Exec("UPDATE todos SET status=$1 WHERE id=$2", body.Status, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Status updated"})
}

func ConfirmTodoStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	_, err = config.DB.Exec("UPDATE todos SET status=true WHERE id=$1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to confirm task"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Task confirmed"})
}
