$services = @("auth", "comment", "feed", "gateway", "like", "like-batch-updater", "like-count", "like-updater", "post", "recommendation", "spotify", "user", "user-graph", "user-graph-view", "client")

$loc = Split-Path -Parent $PSCommandPath

$jobArray = New-Object -TypeName System.Collections.ArrayList
$curArray = New-Object -TypeName System.Collections.ArrayList

foreach ($service in $services) {
    $cur = $loc + "\" + $service
    $job = Start-Job -ScriptBlock { Set-Location $args[0]; npm run build } -ArgumentList $cur
    $curArray.Add($cur)
    $jobArray.Add($job)
}

for ($i = 0; $i -lt $curArray.Count; $i++) {
    Write-Output $curArray[$i]
    Receive-Job -Wait -Job $jobArray[$i]
}
