const serverUrl = "http://localhost:3000";

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Shop API",
    version: "1.0.0",
    description: "API for users, products and basket operations."
  },
  servers: [{ url: serverUrl }],
  tags: [
    { name: "Users", description: "Authorization and profile endpoints" },
    { name: "Products", description: "Catalog and filtering" }
  ],
  components: {
    schemas: {
      ApiError: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string", example: "Invalid credentials" }
        }
      },
      CartItem: {
        type: "object",
        required: ["id", "name", "image", "categoryName", "price", "quantity"],
        properties: {
          id: { type: "number", example: 101 },
          name: { type: "string", example: "Sassicaia 2018" },
          image: { type: "string", example: "/public/Sassicaia.jfif" },
          categoryName: { type: "string", example: "Wine" },
          price: { type: "number", example: 32000 },
          quantity: { type: "number", example: 2 }
        }
      },
      Delivery: {
        type: "object",
        required: ["id", "createdAt", "status", "address", "itemsCount", "total"],
        properties: {
          id: { type: "number", example: 1742512000000 },
          createdAt: { type: "string", format: "date-time" },
          status: { type: "string", example: "Оформлен" },
          address: { type: "string", example: "Минск, ул. Колесникова, 3" },
          phone: { type: "string", example: "+375290000000" },
          email: { type: "string", format: "email" },
          paymentMethod: { type: "string", example: "card" },
          itemsCount: { type: "number", example: 4 },
          total: { type: "number", example: 64000 }
        }
      },
      User: {
        type: "object",
        required: ["id", "name", "email", "login", "phone", "password", "cart", "deliveries"],
        properties: {
          id: { type: "number", example: 1 },
          name: { type: "string", example: "Ivan Petrov" },
          email: { type: "string", format: "email", example: "ivan@mail.com" },
          login: { type: "string", example: "ivan_petrov" },
          phone: { type: "string", example: "+375290000000" },
          password: { type: "string", example: "secret" },
          cart: {
            type: "array",
            items: { $ref: "#/components/schemas/CartItem" }
          },
          deliveries: {
            type: "array",
            items: { $ref: "#/components/schemas/Delivery" }
          }
        }
      },
      Product: {
        type: "object",
        required: [
          "id",
          "name",
          "description",
          "categoryName",
          "price",
          "rating",
          "volume",
          "country",
          "image",
          "inStock",
          "popular"
        ],
        properties: {
          id: { type: "number", example: 1 },
          name: { type: "string", example: "Macallan" },
          description: { type: "string", example: "Single malt whisky" },
          categoryName: { type: "string", example: "Whisky" },
          price: { type: "number", example: 24000 },
          rating: { type: "number", example: 4.8 },
          volume: { type: "string", example: "700ml" },
          country: { type: "string", example: "Scotland" },
          image: { type: "string", example: "/public/Macallan.jfif" },
          inStock: { type: "boolean", example: true },
          popular: { type: "boolean", example: true }
        }
      },
      LoginPayload: {
        type: "object",
        required: ["identifier", "password"],
        properties: {
          identifier: { type: "string", example: "ivan@mail.com" },
          password: { type: "string", example: "secret" }
        }
      },
      RegisterPayload: {
        type: "object",
        required: ["name", "email", "login", "phone", "password"],
        properties: {
          name: { type: "string", example: "Ivan Petrov" },
          email: { type: "string", format: "email", example: "ivan@mail.com" },
          login: { type: "string", example: "ivan_petrov" },
          phone: { type: "string", example: "+375290000000" },
          password: { type: "string", example: "secret" }
        }
      },
      UpdateUserPayload: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          login: { type: "string" },
          phone: { type: "string" },
          password: { type: "string" },
          oldPassword: { type: "string" },
          cart: {
            type: "array",
            items: { $ref: "#/components/schemas/CartItem" }
          },
          deliveries: {
            type: "array",
            items: { $ref: "#/components/schemas/Delivery" }
          }
        }
      }
    }
  },
  paths: {
    "/users/login": {
      post: {
        tags: ["Users"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginPayload" }
            }
          }
        },
        responses: {
          "200": {
            description: "Authorized user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          "400": {
            description: "Validation error",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } }
          },
          "401": {
            description: "Invalid credentials",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } }
          }
        }
      }
    },
    "/users/registration": {
      post: {
        tags: ["Users"],
        summary: "Register user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterPayload" }
            }
          }
        },
        responses: {
          "201": {
            description: "Created user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          "400": {
            description: "Validation error",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } }
          },
          "409": {
            description: "User already exists",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } }
          }
        }
      }
    },
    "/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current user by session cookie",
        responses: {
          "200": {
            description: "Current user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          "401": {
            description: "Unauthorized",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } }
          }
        }
      }
    },
    "/users/logout": {
      post: {
        tags: ["Users"],
        summary: "Logout user and clear cookie",
        responses: {
          "200": {
            description: "Logout message",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["message"],
                  properties: {
                    message: { type: "string", example: "Logged out" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users/{id}": {
      patch: {
        tags: ["Users"],
        summary: "Update current user",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "number" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserPayload" }
            }
          }
        },
        responses: {
          "200": {
            description: "Updated user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          "400": {
            description: "Validation error",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } }
          },
          "401": {
            description: "Unauthorized",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } }
          },
          "404": {
            description: "User not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } }
          },
          "409": {
            description: "Conflict",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } }
          }
        }
      }
    },
    "/product": {
      get: {
        tags: ["Products"],
        summary: "Get products with optional filters",
        parameters: [
          { in: "query", name: "search", schema: { type: "string" } },
          { in: "query", name: "type", schema: { type: "string" } },
          {
            in: "query",
            name: "sort",
            schema: {
              type: "string",
              enum: ["price-asc", "price-desc", "name", "rating"]
            }
          },
          { in: "query", name: "inStock", schema: { type: "boolean" } }
        ],
        responses: {
          "200": {
            description: "Product list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" }
                }
              }
            }
          }
        }
      }
    },
    "/product/search": {
      get: {
        tags: ["Products"],
        summary: "Search products",
        parameters: [{ in: "query", name: "q", schema: { type: "string" } }],
        responses: {
          "200": {
            description: "Filtered products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" }
                }
              }
            }
          }
        }
      }
    },
    "/product/type/{type}": {
      get: {
        tags: ["Products"],
        summary: "Filter products by type",
        parameters: [{ in: "path", name: "type", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            description: "Filtered products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" }
                }
              }
            }
          }
        }
      }
    },
    "/product/popular/{value}": {
      get: {
        tags: ["Products"],
        summary: "Filter products by popularity",
        parameters: [{ in: "path", name: "value", required: true, schema: { type: "boolean" } }],
        responses: {
          "200": {
            description: "Filtered products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" }
                }
              }
            }
          }
        }
      }
    },
    "/product/availability/{value}": {
      get: {
        tags: ["Products"],
        summary: "Filter products by availability",
        parameters: [{ in: "path", name: "value", required: true, schema: { type: "boolean" } }],
        responses: {
          "200": {
            description: "Filtered products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" }
                }
              }
            }
          }
        }
      }
    },
    "/product/sort/price-asc": {
      get: {
        tags: ["Products"],
        summary: "Sort products by price ascending",
        responses: {
          "200": {
            description: "Sorted products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" }
                }
              }
            }
          }
        }
      }
    },
    "/product/sort/price-desc": {
      get: {
        tags: ["Products"],
        summary: "Sort products by price descending",
        responses: {
          "200": {
            description: "Sorted products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" }
                }
              }
            }
          }
        }
      }
    },
    "/product/sort/name": {
      get: {
        tags: ["Products"],
        summary: "Sort products by name",
        responses: {
          "200": {
            description: "Sorted products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" }
                }
              }
            }
          }
        }
      }
    },
    "/product/sort/rating": {
      get: {
        tags: ["Products"],
        summary: "Sort products by rating",
        responses: {
          "200": {
            description: "Sorted products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" }
                }
              }
            }
          }
        }
      }
    }
  }
} as const;
