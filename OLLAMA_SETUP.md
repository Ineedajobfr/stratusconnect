# Max AI Setup Guide - Free Local Models

This guide shows you how to set up Max AI with free local models using Ollama.

## 🚀 Quick Start

### 1. Install Ollama

**Windows:**
```bash
# Download from https://ollama.com
# Or use winget
winget install Ollama.Ollama
```

**macOS:**
```bash
# Download from https://ollama.com
# Or use homebrew
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Pull Free Models

```bash
# Start Ollama service
ollama serve

# In another terminal, pull the models
ollama pull llama3:8b
ollama pull mixtral:8x22b
ollama pull gemma2:9b
```

### 3. Set Environment Variables

Create `.env` file in project root:

```env
OLLAMA_URL=http://127.0.0.1:11434
PRIMARY_MODEL=llama3:8b
REASONING_MODEL=mixtral:8x22b
SUMMARY_MODEL=gemma2:9b
```

### 4. Test Max AI

```bash
npm run dev
```

## 🧠 Model Capabilities

### **Llama 3 8B (Primary Model)**
- **Use for:** General dialogue, intake, reassurance
- **Strengths:** Fast, good conversation flow
- **Context:** 8K tokens
- **Speed:** Very fast

### **Mixtral 8x22B (Reasoning Model)**
- **Use for:** Complex reasoning, tool calling, pricing
- **Strengths:** Function calling, mathematical reasoning
- **Context:** 32K tokens
- **Speed:** Medium

### **Gemma 2 9B (Summary Model)**
- **Use for:** Summaries, compliance, policy
- **Strengths:** Efficient, good for long-form content
- **Context:** 8K tokens
- **Speed:** Fast

## 🔧 Configuration

### Model Routing

Max automatically routes tasks to the best model:

- **Intake & Reassurance** → Llama 3 8B
- **Availability & Pricing** → Mixtral 8x22B
- **Summaries & Compliance** → Gemma 2 9B

### Custom Models

You can use different models by updating the environment variables:

```env
PRIMARY_MODEL=llama3.1:8b
REASONING_MODEL=mixtral:8x7b
SUMMARY_MODEL=gemma2:2b
```

## 🚨 Troubleshooting

### Ollama Not Starting
```bash
# Check if Ollama is running
ollama list

# Restart Ollama
ollama serve
```

### Model Not Found
```bash
# List available models
ollama list

# Pull missing model
ollama pull [model-name]
```

### Performance Issues
- **CPU Only:** Use smaller models (llama3:8b, gemma2:9b)
- **GPU Available:** Use larger models (mixtral:8x22b)
- **Memory:** Close other applications

## 💰 Cost Comparison

| Method | Cost | Quality | Speed |
|--------|------|---------|-------|
| **Local Models** | £0 | High | Fast |
| OpenAI API | £££ | Very High | Very Fast |
| Anthropic API | £££ | Very High | Very Fast |

## 🎯 Max AI Features

### **Professional Aviation Focus**
- UK English responses
- FCA compliance built-in
- Aviation terminology
- Professional tone

### **Intelligent Routing**
- Automatic model selection
- Context-aware responses
- Tool calling when needed
- Conversation memory

### **Zero API Costs**
- Run locally
- No per-token charges
- Complete privacy
- Offline capable

## 🔒 Security

- All data stays local
- No external API calls
- Complete privacy
- FCA compliant

## 📊 Performance

### **Response Times**
- Llama 3 8B: ~200ms
- Mixtral 8x22B: ~800ms
- Gemma 2 9B: ~300ms

### **Memory Usage**
- Llama 3 8B: ~8GB RAM
- Mixtral 8x22B: ~45GB RAM
- Gemma 2 9B: ~6GB RAM

## 🚀 Next Steps

1. **Install Ollama** and pull models
2. **Set environment variables**
3. **Start the application**
4. **Test Max AI** with aviation queries
5. **Customize models** as needed

Max is now ready to help with aviation tasks using free, local AI models!


