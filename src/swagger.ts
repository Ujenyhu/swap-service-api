import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Token Swap Service",
      version: "1.0.0",
      description: "This an api that handles blockchain token swaps on the ethereum and tron blockchain networks",
    },
    components: {
      schemas: {
        swapTokenRequest: {
          type: "object",
          properties: {
            network: {
              type: "string",
              description: "The blockchain network to perform swap on",
            },
            fromToken: {
              type: "string",
              description: "The token symbol you want to swap from",
            },
            toToken: {
              type: "string",
              description: "The token symbol you want to swap to",
            },
            walletKey: {
              type: "string",
              description: "You will pass in the private key of the wallet",
            },
            amount: {
              type: "number",
              description: "Amount you want to swap",
            },
          },
          required: ["network", "fromToken", "toToken", "walletKey", "amount"],
        },

        swapTokenResponse: {
          type: "object",
          nullabe: true,
          properties: {
            network: {
              type: "string",
            },
            description: {
              type: "string",
              //example: "ETH => USDT"
            },
            transactionHash: {
              type: "string",
            }
          }
        },

        ResponseBase: {
          type: "object",
          properties: {
            statusCode: {
              type: "integer",
              //example: 200
            },

            status: {
              type: "string",
              //example: "SUCCESS"
            },

            message: {
              type: "string",
              //example: "Swap was successful"
            },

            data:{
              type: "object",
              nullable: true,
              oneOf: [
                { $ref: "#/components/schemas/swapTokenResponse" },
                { type: "null" },
              ],
              description: "Response data, present only on success"
            }
              
          }

        },

        ResponseBaseError: {
          type: "object",
          properties: {
            statusCode: {
              type: "integer",
              //example: 200
            },

            status: {
              type: "string",
              //example: "SUCCESS"
            },

            message: {
              type: "string",
              //example: "Swap was successful"
            }
              
          }

        }

      },
    },

    tags: [
      {
        name: "Swap",
      },
    ],

    paths: {
      "/swap": {
        post: {
          tags: ["Swap"],
          summary: "Perform a token swap",
          description: "Swap tokens on different networks",
          
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/swapTokenRequest",
                },
              },
            },
          },

          responses: {
            "200": {
              description: "Swap successful",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ResponseBase", 
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ResponseBaseError", 
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ResponseBaseError", 
                  },
                },
              },
            },
          },
        },
      },

      "/estimateSwap": {
        post: {
          tags: ["Swap"],
          summary: "Estimate a token swap",
          description: "Swap tokens on different networks",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/swapTokenRequest",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Swap successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
            },
            "500": {
              description: "Internal server error",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export const setupSwagger = (app: Express) => {
  app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
