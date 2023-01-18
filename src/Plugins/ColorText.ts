import type { Module } from 'i18next'

export default {
    type: 'postProcessor',
    name: 'ColorText',
    process: (value: string): string => {
        if (!value.includes('<<')) {
            return value
        }

        return value.replace(/<<(.*?)\|(.*?)>>/g, '<span style="color:$1">$2</span>')
    }
} as Module
