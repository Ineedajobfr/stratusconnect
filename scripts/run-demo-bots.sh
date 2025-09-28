#!/bin/bash
# Demo Bots Runner Script - Beta Terminal Testing
# FCA Compliant Aviation Platform - Automated Demo Execution

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PLAYWRIGHT_DIR="$PROJECT_ROOT/demo-bots/playwright"

echo -e "${BLUE}🎬 Demo Bots Runner - StratusConnect Aviation Platform${NC}"
echo "=================================================="

# Check if we're in the right directory
if [ ! -d "$PLAYWRIGHT_DIR" ]; then
    echo -e "${RED}❌ Error: Playwright directory not found at $PLAYWRIGHT_DIR${NC}"
    exit 1
fi

# Function to check environment variables
check_env() {
    echo -e "${YELLOW}🔍 Checking environment variables...${NC}"
    
    local missing_vars=()
    
    if [ -z "$STRATUS_URL" ]; then
        missing_vars+=("STRATUS_URL")
    fi
    
    if [ -z "$SUPABASE_EVENTS_URL" ]; then
        missing_vars+=("SUPABASE_EVENTS_URL")
    fi
    
    if [ -z "$SUPABASE_URL" ]; then
        missing_vars+=("SUPABASE_URL")
    fi
    
    if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        missing_vars+=("SUPABASE_SERVICE_ROLE_KEY")
    fi
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing required environment variables:${NC}"
        printf '%s\n' "${missing_vars[@]}"
        echo ""
        echo -e "${YELLOW}💡 Set them with:${NC}"
        echo "export STRATUS_URL='http://localhost:8080'"
        echo "export SUPABASE_EVENTS_URL='https://your-project.functions.supabase.co/events-recorder'"
        echo "export SUPABASE_URL='https://your-project.supabase.co'"
        echo "export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All environment variables set${NC}"
}

# Function to install dependencies
install_deps() {
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    cd "$PLAYWRIGHT_DIR"
    
    if [ ! -d "node_modules" ]; then
        npm install
    else
        echo -e "${GREEN}✅ Dependencies already installed${NC}"
    fi
    
    # Install Playwright browsers if not already installed
    if ! npx playwright --version > /dev/null 2>&1; then
        echo -e "${YELLOW}🎭 Installing Playwright browsers...${NC}"
        npx playwright install
    else
        echo -e "${GREEN}✅ Playwright browsers already installed${NC}"
    fi
}

# Function to run tests
run_tests() {
    local test_type="$1"
    echo -e "${YELLOW}🧪 Running demo tests...${NC}"
    
    cd "$PLAYWRIGHT_DIR"
    
    case "$test_type" in
        "video")
            echo -e "${BLUE}🎥 Running video demo test...${NC}"
            npx playwright test demo-video.spec.ts --headed
            ;;
        "broker")
            echo -e "${BLUE}🏢 Running broker demo test...${NC}"
            npx playwright test broker.spec.ts
            ;;
        "operator")
            echo -e "${BLUE}✈️ Running operator demo test...${NC}"
            npx playwright test operator.spec.ts
            ;;
        "pilot")
            echo -e "${BLUE}👨‍✈️ Running pilot demo test...${NC}"
            npx playwright test pilot.spec.ts
            ;;
        "full")
            echo -e "${BLUE}🔄 Running full workflow test...${NC}"
            npx playwright test full-workflow.spec.ts
            ;;
        "all")
            echo -e "${BLUE}🎯 Running all demo tests...${NC}"
            npx playwright test
            ;;
        *)
            echo -e "${RED}❌ Unknown test type: $test_type${NC}"
            echo "Available types: video, broker, operator, pilot, full, all"
            exit 1
            ;;
    esac
}

# Function to show results
show_results() {
    echo -e "${YELLOW}📊 Test Results Summary${NC}"
    echo "====================="
    
    cd "$PLAYWRIGHT_DIR"
    
    if [ -d "test-results" ]; then
        echo -e "${GREEN}✅ Test results directory exists${NC}"
        
        # Count test files
        local test_count=$(find test-results -name "*.png" | wc -l)
        echo -e "📸 Screenshots: $test_count"
        
        # Count videos
        if [ -d "test-results/videos" ]; then
            local video_count=$(find test-results/videos -name "*.webm" | wc -l)
            echo -e "🎥 Videos: $video_count"
        fi
        
        echo ""
        echo -e "${BLUE}📁 Results location: $PLAYWRIGHT_DIR/test-results/${NC}"
    else
        echo -e "${YELLOW}⚠️ No test results found${NC}"
    fi
    
    if [ -d "playwright-report" ]; then
        echo -e "${BLUE}📋 HTML Report: $PLAYWRIGHT_DIR/playwright-report/index.html${NC}"
    fi
}

# Main execution
main() {
    local test_type="${1:-all}"
    
    echo -e "${BLUE}🚀 Starting demo bots execution...${NC}"
    echo "Test type: $test_type"
    echo ""
    
    check_env
    install_deps
    run_tests "$test_type"
    show_results
    
    echo ""
    echo -e "${GREEN}🎉 Demo bots execution completed successfully!${NC}"
    echo -e "${BLUE}📋 Check the results in: $PLAYWRIGHT_DIR/test-results/${NC}"
}

# Handle script arguments
case "${1:-}" in
    "help"|"-h"|"--help")
        echo "Demo Bots Runner - StratusConnect Aviation Platform"
        echo ""
        echo "Usage: $0 [test_type]"
        echo ""
        echo "Test types:"
        echo "  video    - Run video recording demo"
        echo "  broker   - Run broker terminal demo"
        echo "  operator - Run operator terminal demo"
        echo "  pilot    - Run pilot terminal demo"
        echo "  full     - Run full workflow demo"
        echo "  all      - Run all demos (default)"
        echo ""
        echo "Environment variables required:"
        echo "  STRATUS_URL"
        echo "  SUPABASE_EVENTS_URL"
        echo "  SUPABASE_URL"
        echo "  SUPABASE_SERVICE_ROLE_KEY"
        ;;
    *)
        main "$@"
        ;;
esac
