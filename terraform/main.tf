terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.39.0"
    }
  }
}

provider "azurerm" {
  features {}
}
