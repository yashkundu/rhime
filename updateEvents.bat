@echo off
set cur_dir=%~dp0
for /d %%f in ("%cur_dir%\*") do (
    set "flag="
    if "%%f" == "%cur_dir%\gateway" set flag=1
    if "%%f" == "%cur_dir%\auth" set flag=1
    if "%%f" == "%cur_dir%\user" set flag=1
    if "%%f" == "%cur_dir%\userGraph" set flag=1
    if "%%f" == "%cur_dir%\spotify" set flag=1
    if "%%f" == "%cur_dir%\post" set flag=1
    if "%%f" == "%cur_dir%\comment" set flag=1
    if "%%f" == "%cur_dir%\feed" set flag=1
    if "%%f" == "%cur_dir%\like" set flag=1
    if "%%f" == "%cur_dir%\likeUpdater" set flag=1
    if "%%f" == "%cur_dir%\likeBatchUpdater" set flag=1
    if defined flag start "" cd %%f ^&^& npm run updateEvents ^&^& exit
)