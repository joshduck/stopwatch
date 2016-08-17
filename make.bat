set gadgetdir=Gadget
set gadgetfile=Stopwatch.gadget
set path=%path%;C:/Program Files/WinRAR/
rem Gadget-%time:~0,2%-%time:~3,2%-%time:~6,2%.gadget
cd %gadgetdir%
winrar a -r ../temp.zip *
cd ..
del *.gadget
echo %gadgetfile%
rename temp.zip %gadgetfile%
%gadgetfile%
