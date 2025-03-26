package models

import (
	"regexp"
	"strings"
)

func createTriggeringTaskFieldVariableName(fieldName string) string {
	// Replace spaces with underscores and convert to lowercase
	re := regexp.MustCompile(`\s+`)
	processedName := re.ReplaceAllString(fieldName, "_")
	return "triggering-task." + strings.ToLower(processedName)
}
