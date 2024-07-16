package handlers

import (
    "github.com/gofiber/fiber/v2"
    "github.com/golang-jwt/jwt/v4"
    "golang.org/x/crypto/bcrypt"
    "time"
    "os"
    "github.com/pksingh21/pyqbackend/config"
	"github.com/pksingh21/pyqbackend/entity"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY")) // Set this in your environment variables

// GenerateJWTToken generates a JWT token for a given user ID
func generateJWTToken(userID uint) (string, error) {
    claims := jwt.MapClaims{
        "user_id": userID,
        "exp":     time.Now().Add(time.Hour * 72).Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtKey)
}

// VerifyJWTToken verifies the JWT token and returns the user ID
func verifyJWTToken(tokenString string) (uint, error) {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, jwt.NewValidationError("Unexpected signing method", jwt.ValidationErrorSignatureInvalid)
        }
        return jwtKey, nil
    })

    if err != nil {
        return 0, err
    }

    claims, ok := token.Claims.(jwt.MapClaims)
    if !ok || !token.Valid {
        return 0, jwt.NewValidationError("Invalid token", jwt.ValidationErrorSignatureInvalid)
    }

    userID, ok := claims["user_id"].(float64)
    if !ok {
        return 0, jwt.NewValidationError("Invalid token claims", jwt.ValidationErrorClaimsInvalid)
    }

    return uint(userID), nil
}

// HashPassword hashes a password
func hashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    if err != nil {
        return "", err
    }
    return string(bytes), nil
}

// VerifyPassword compares a hashed password with a plaintext password
func verifyPassword(hashedPassword, password string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
    return err == nil
}

// SignUp handles user registration
func SignUp(c *fiber.Ctx) error {
    user := new(entities.User)

    if err := c.BodyParser(user); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    hashedPassword, err := hashPassword(user.Password)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
    }
    user.Password = hashedPassword

    config.Database.Create(&user)

    token, err := generateJWTToken(user.ID)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate JWT token"})
    }
    user.Password = "" // Clear password from response
    return c.Status(fiber.StatusCreated).JSON(fiber.Map{"user": user, "token": token})
}

// SignIn handles user login
func SignIn(c *fiber.Ctx) error {
    input := new(struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    })

    if err := c.BodyParser(input); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    var user entities.User
    if err := config.Database.Where("email = ?", input.Email).First(&user).Error; err != nil {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
    }

    if !verifyPassword(user.Password, input.Password) {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
    }

    token, err := generateJWTToken(user.ID)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate JWT token"})
    }

    user.Password = ""
    return c.Status(fiber.StatusOK).JSON(fiber.Map{"user": user, "token": token})
}

// JWTMiddleware middleware for JWT validation
func JWTMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        token := c.Get("Authorization")
        if token == "" {
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing authorization token"})
        }

        userID, err := verifyJWTToken(token)
        if err != nil {
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
        }

        c.Locals("userID", userID)
        return c.Next()
    }
}
