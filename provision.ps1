# Run this script by opening PowerShell as administrator and run
#   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://yakov.ca/provision.ps1'))

#Requires -RunAsAdministrator

$apps = @{
    Home = @(
        "7zip",
        "googlechrome",
        "microsoft-teams",
        "office365business"
        "opera",
        "skype",
        "viber",
        "vlc"
        # TODO WeatherEye
    );
    Yakov = @(
        "7zip",
        "8gadgetpack",
        "adoptopenjdk",
        "brave",
        "cmake",
        "discord",
        "docker-desktop",
        "foxitreader",
        "gitextensions",
        "intellijidea-ultimate",
        "paint.net"
        "putty",
        "python",
        "steam-client",
        "transmission",
        "visualstudio2019buildtools",
        "vlc",
        "vscode",
        "windirstat",
        "xming"
    );
    YakovSED = @(
        "microsoft-teams",
        "mtputty",
        "openvpn",
        "slack"
    );
}

$selection = ""
while (-not($apps.Contains($selection))) {
    $selection = Read-Host "Enter profile name: ($($apps.Keys))"
}

$choco = Get-Command -Name choco.exe -ErrorAction SilentlyContinue
if (-not($choco)) {
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
}

&choco install -y $apps[$selection]
