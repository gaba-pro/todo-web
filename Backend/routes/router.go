package routes

import (
	"todoapp/controllers"
	"todoapp/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.POST("/login", controllers.LoginHandler)

	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())

	api.GET("/users", controllers.GetAllUsers)
	api.GET("/todos", controllers.GetTodos)
	api.POST("/todos", middleware.Authorize("assigner"), controllers.CreateTodo)
	api.PUT("/todos/:id", middleware.Authorize("assigner"), controllers.UpdateTodo)
	api.DELETE("/todos/:id", middleware.Authorize("assigner"), controllers.DeleteTodo)
	api.PUT("/todos/:id/status", controllers.UpdateTodoStatus)
	api.PUT("/todos/:id/confirm", controllers.ConfirmTodoStatus)
}
