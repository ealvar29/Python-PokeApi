// 🔒 netlify/functions/chat.js
// Enhanced with detailed logging for production debugging

exports.handler = async (event, context) => {
  // 📝 Log every request
  console.log("🚀 Function started");
  console.log("📊 Request details:", {
    method: event.httpMethod,
    headers: event.headers,
    origin: event.headers.origin || "No origin header",
  });

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    console.log("❌ Method not allowed:", event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  // Set up CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    console.log("✅ Handling OPTIONS preflight request");
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    // 🔑 Detailed API key checking
    console.log("🔍 Checking environment variables...");

    const apiKey = process.env.OPENAI_API_KEY;

    // Log API key status (WITHOUT revealing the actual key!)
    if (!apiKey) {
      console.error(
        "❌ OPENAI_API_KEY environment variable is missing completely"
      );
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "OpenAI API key not configured",
          role: "assistant",
          content:
            "Sorry, the AI service is not properly configured. Please contact the administrator.",
        }),
      };
    }

    if (apiKey.trim() === "") {
      console.error("❌ OPENAI_API_KEY environment variable is empty");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "OpenAI API key is empty",
          role: "assistant",
          content: "Sorry, the AI service configuration is incomplete.",
        }),
      };
    }

    // Check API key format (should start with 'sk-')
    if (!apiKey.startsWith("sk-")) {
      console.error(
        "❌ OPENAI_API_KEY has invalid format (should start with sk-)"
      );
      console.error("🔍 Key starts with:", apiKey.substring(0, 3) + "...");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "OpenAI API key has invalid format",
          role: "assistant",
          content:
            "Sorry, the AI service configuration has an invalid key format.",
        }),
      };
    }

    console.log("✅ API key found and has correct format");
    console.log("🔍 Key length:", apiKey.length);
    console.log("🔍 Key prefix:", apiKey.substring(0, 7) + "...");

    // 📨 Parse and validate request body
    console.log("📨 Parsing request body...");

    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
      console.log("✅ Request body parsed successfully");
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Invalid JSON in request body",
          role: "assistant",
          content: "Sorry, there was an error with your message format.",
        }),
      };
    }

    const { messages } = requestBody;

    if (!messages) {
      console.error("❌ No messages field in request body");
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing messages field",
          role: "assistant",
          content: "Sorry, no messages were provided.",
        }),
      };
    }

    if (!Array.isArray(messages)) {
      console.error("❌ Messages is not an array:", typeof messages);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Messages must be an array",
          role: "assistant",
          content: "Sorry, messages format is incorrect.",
        }),
      };
    }

    console.log("✅ Messages validated");
    console.log("📊 Message count:", messages.length);
    console.log(
      "📊 Last message:",
      messages[messages.length - 1]?.content?.substring(0, 50) + "..."
    );

    // 🤖 Make OpenAI API call
    console.log("🤖 Calling OpenAI API...");

    const openaiRequest = {
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    };

    console.log("📋 OpenAI request config:", {
      model: openaiRequest.model,
      messageCount: openaiRequest.messages.length,
      maxTokens: openaiRequest.max_tokens,
      temperature: openaiRequest.temperature,
    });

    const startTime = Date.now();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(openaiRequest),
    });

    const responseTime = Date.now() - startTime;
    console.log(`⏱️ OpenAI API response time: ${responseTime}ms`);
    console.log("📊 OpenAI response status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ OpenAI API error details:");
      console.error("Status:", response.status);
      console.error("Status Text:", response.statusText);
      console.error("Error Body:", errorData);

      // Common error codes and their meanings
      let userMessage =
        "Sorry, I'm having trouble thinking right now. Please try again in a moment! 🤖";

      if (response.status === 401) {
        console.error("🔑 Authentication error - likely invalid API key");
        userMessage =
          "Authentication error - please check API key configuration.";
      } else if (response.status === 429) {
        console.error("⏱️ Rate limit exceeded");
        userMessage =
          "I'm a bit overwhelmed right now. Please try again in a moment!";
      } else if (response.status === 400) {
        console.error("📝 Bad request - check request format");
      }

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: "OpenAI API error",
          role: "assistant",
          content: userMessage,
        }),
      };
    }

    const data = await response.json();
    console.log("✅ OpenAI API success!");
    console.log("📊 Response data structure:", {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      hasMessage: !!data.choices?.[0]?.message,
      messageRole: data.choices?.[0]?.message?.role,
      contentLength: data.choices?.[0]?.message?.content?.length,
    });

    const aiMessage = data.choices[0].message;
    console.log(
      "🤖 AI Response preview:",
      aiMessage.content.substring(0, 100) + "..."
    );

    // 🎉 Success!
    console.log("🎉 Function completed successfully");
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(aiMessage),
    };
  } catch (error) {
    console.error("💥 Unexpected error in function:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        role: "assistant",
        content: "Oops! Something went wrong on my end. Please try again! 🔧",
      }),
    };
  }
};
