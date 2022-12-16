terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.36.0"
    }
  }
}

provider "azurerm" {
  features {}
}
