package models
import "github.com/golang-jwt/jwt/v4"

type Todo struct {
	ID        int    `json:"id"`
	Task      string `json:"task"`
	Assign    string `json:"assign"`
	Status    bool   `json:"status"`
	Deskripsi string `json:"deskripsi"`
	Dateline  string `json:"dateline"`
}

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`	
	Role     string `json:"role"`
}

type Claims struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}
