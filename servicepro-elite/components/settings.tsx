import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Settings() {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    emailNotifications: true,
    theme: 'light',
    language: 'en',
    ticketsPerPage: 10,
  })

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({ ...prev, [setting]: value }))
  }

  const handleSaveSettings = () => {
    // TODO: Implement saving settings to backend
    console.log('Saving settings:', settings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account and application settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="notifications">Enable Notifications</Label>
          <Switch
            id="notifications"
            checked={settings.notificationsEnabled}
            onCheckedChange={(checked) => handleSettingChange('notificationsEnabled', checked)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emailNotifications">Email Notifications</Label>
          <Switch
            id="emailNotifications"
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ticketsPerPage">Tickets Per Page</Label>
          <Input
            id="ticketsPerPage"
            type="number"
            value={settings.ticketsPerPage}
            onChange={(e) => handleSettingChange('ticketsPerPage', parseInt(e.target.value))}
          />
        </div>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </CardContent>
    </Card>
  )
}

