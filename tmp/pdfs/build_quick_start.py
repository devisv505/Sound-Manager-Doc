from pathlib import Path
from xml.sax.saxutils import escape
import json
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image

ROOT = Path.cwd()
OUT = ROOT / 'output/pdf/Sound-Manager-Quick-Start.pdf'
FONTS = Path('/Users/devisv/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype')
for name, file in [('Body','Rubik-Regular.ttf'),('Bold','Rubik-Bold.ttf'),('Mono','LiberationMono-Regular.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS/file)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold',italic='Body',boldItalic='Bold')
W,H=595.276,841.89
BG='#FBF7ED'; INK='#293C32'; MUTED='#64735B'; SAND='#EDE7D4'; ACCENT='#B87957'
URL='https://devisv505.github.io/Sound-Manager-Doc/'
c=canvas.Canvas(str(OUT),pagesize=(W,H))
c.setTitle('Sound Manager | Quick Start & Node Guide')
c.setAuthor('DEV505')
c.setSubject('Scene setup, all 49 nodes, and ten demos')

def box(x,y,w,h,color,r=10):
    c.setFillColor(HexColor(color)); c.roundRect(x,H-y-h,w,h,r,fill=1,stroke=0)
def text(s,x,y,size=11,color=INK,font='Body'):
    c.setFillColor(HexColor(color)); c.setFont(font,size); c.drawString(x,H-y-size,s)
def para(s,x,y,w,size=10.3,color=INK,leading=None):
    st=ParagraphStyle('p',fontName='Body',fontSize=size,leading=leading or size*1.42,textColor=HexColor(color))
    p=Paragraph(s,st); _,h=p.wrap(w,1000); p.drawOn(c,x,H-y-h); return h

def link(label,path,x,y,w=490,size=10):
    return para(f'<link href="{URL+path}" color="{INK}"><u>{escape(label)}</u></link>',x,y,w,size)
def page(n,section,title,sub):
    c.setFillColor(HexColor(BG)); c.rect(0,0,W,H,fill=1,stroke=0)
    text('DEV505 / SOUND MANAGER',40,27,9,MUTED,'Bold')
    text(section.upper(),370,27,9,MUTED,'Bold')
    text(title,40,59,27,INK,'Bold')
    para(sub,40,102,515,10.5,MUTED)
    c.setStrokeColor(HexColor('#D4D9C7')); c.line(40,57,W-40,57)
    link('Full instructions: devisv505.github.io/Sound-Manager-Doc/', '',40,797,size=8.5)
    text(f'{n} / 6',522,797,8.5,MUTED)
def finish(): c.showPage()
def step(num,title,body,y):
    box(40,y,25,25,INK,6); text(str(num),48,y+4,12,'#FFF0B9','Bold')
    text(title,77,y,12,INK,'Bold')
    h=para(body,77,y+22,474,10.3)
    return y+22+h+18

page(1,'01 / Get started','A little sound.','A short, practical guide to Sound Manager for Unity.\n')
para('Build a simple scene that plays an ignition, keeps a fire crackling, and plays an ending when you stop it.',40,145,270,12)
para('You will use the included <b>Campfire</b> graph. No graph editing is needed for your first listen.',40,217,265,10,MUTED)
im=Image.open(ROOT/'src/assets/demos/01-campfire/hero.png')
c.drawImage(ImageReader(im),330,H-145-122,width=225,height=122,preserveAspectRatio=True,anchor='c',mask='auto')
y=291
y=step(1,'Open a new scene', 'Import Sound Manager and its samples. Create and save a basic scene with a camera. Keep one enabled <b>Audio Listener</b> on the camera. Set its position to <b>(0, 1, -3)</b> and rotation to <b>(0, 0, 0)</b>.',y)
y=step(2,'Let the panel prepare the scene', 'Open <b>Tools > DEV505 > Sound Manager > Getting Started</b>. Click <b>Set up active scene</b>. Check Sound Manager, Listening point, and Playback settings. Setup adds missing components and keeps existing settings.',y)
y=step(3,'Register Campfire and generate its key', 'In the Project window, find <b>Assets/DEV505/SoundManager/Samples/01-Campfire/Campfire.soundgraph</b>. Drag it into the panel beside <b>Register</b>, then click Register. Click <b>Generate sound keys</b> and wait for compilation. Save the scene.',y)
y=step(4,'Add the script and listen', 'Create <b>FirstSound.cs</b> using the code on page 2. Attach it to an empty GameObject at <b>(0, 0, 0)</b>. Press <b>Play</b>. You should hear ignition followed by a continuous crackle.',y)
assert y<742,y
box(40,737,515,39,SAND)
para('<b>First time in Unity?</b> Project lists your files. Hierarchy lists scene objects. Inspector shows the selected object\'s settings.',52,745,490,9.3)
finish()

page(2,'02 / Play & stop','Keep one handle.','A handle identifies the sound you started, so you can stop that same play later.')
text('FirstSound.cs  /  complete component',53,147,10,'#FCE7AD','Bold')
code=(ROOT/'examples/FirstSound.cs').read_text().rstrip().splitlines()
code=[line.replace('Debug.LogWarning($"Could not play Campfire: {result.Status}", this);','Debug.LogWarning($"Campfire: {result.Status}", this);') for line in code]
box(40,137,515,391,INK)
text('FirstSound.cs  /  complete component',53,147,10,'#FCE7AD','Bold')
for i,line in enumerate(code):text(line,53,172+i*10.2,8.1,'#F8F4E9','Mono')
para('In Play Mode, select your object and open the <b>First Sound</b> component menu in the Inspector. Choose <b>Stop sound</b>, then <b>Play sound</b> to hear it again. Disabling the component also stops it.',40,541,515,10)
text('How the Campfire graph works',40,606,14,INK,'Bold')
for y,title,desc in [(635,'START','On Start triggers ignition. Its Finished output starts the loop.'),(666,'LOOP','Wave Asset supplies a clip; Play Audio repeats it with Loop enabled.'),(697,'STOP','On Stop stops ignition and loop, and starts the extinguish clip.')]:
    text(title,40,y,9,ACCENT,'Bold'); para(desc,95,y,460,9.5)
link('See the graph and the complete setup guide', 'demos/01-campfire/#read-the-graph',40,735)
para('No sound? Check registration, the enabled listener, Game view audio mute, and Console errors. A key alone does not register a sound.',40,755,515,9,MUTED)
finish()

catalogue=json.loads((ROOT/'content-data/node-catalogue.json').read_text())['nodes']
colors=json.loads((ROOT/'content-data/node-colors.json').read_text())
bycat={a['name']:a for a in colors['categories']}
short={
'OnStart':'Starts a branch when this play begins.',
'OnSignal':'Runs a branch when this play receives a named signal.',
'OnStop':'Runs the ending branch during a normal stop request.',
'WaveAsset':'Provides a recording or a trimmed section of one.',
'RandomClip':'Chooses a clip; No Repeat can avoid the previous choice.',
'SelectByIndex':'Chooses a clip by number. The first choice is index 0.',
'PlayAudio':'Plays a clip, with loop, volume, speed, and fade controls.',
'FloatParameter':'Reads a decimal value from the game, with optional smoothing.',
'IntParameter':'Reads a whole-number value, such as a surface choice.',
'BoolParameter':'Reads a true/false value supplied by the game.',
'AssetParameter':'Chooses a permitted clip for future playback starts.',
'RandomFloat':'Picks a decimal number; Single Value keeps one per play.',
'RandomInt':'Picks a whole number; can avoid repeating its last choice.',
'RandomBranch':'Sends a command down one randomly chosen branch.',
'Float':'Provides a fixed decimal number.',
'Int':'Provides a fixed whole number.',
'Bool':'Provides a fixed true/false value.',
'RemapFloat':'Maps a number from one range into another.',
'Curve':'Maps an input through a curve you draw.',
'FloatCompare':'Compares two decimal numbers and returns true or false.',
'FloatMath':'Adds, subtracts, multiplies, divides, or combines decimals.',
'MultiplierToSemitones':'Converts a playback-speed multiplier into semitones.',
'SemitonesToMultiplier':'Converts semitones into a playback-speed multiplier.',
'ConvertToFloat':'Converts a whole number into a decimal value.',
'ConvertToInt':'Converts a decimal using rounding, flooring, or truncation.',
'FloatFunction':'Applies a function such as absolute value, square root, or sine.',
'IntCompare':'Compares two whole numbers and returns true or false.',
'IntFunction':'Changes an integer with absolute value, negation, or sign.',
'IntOp':'Performs whole-number arithmetic, including remainder.',
'SmoothstepFloat':'Maps a range to 0-1 with a gentle S-shaped response.',
'SelectFloat':'Selects one decimal input by index, starting at 0.',
'SelectInt':'Selects one whole-number input by index, starting at 0.',
'TrackCondition':'Watches a condition and signals when it becomes true or false.',
'Delay':'Waits a set number of seconds before forwarding a command.',
'Sequence':'Triggers outputs in order, immediately; does not wait for sounds.',
'Branch':'Chooses True or False when a command arrives.',
'BranchByIndex':'Sends a command to one numbered output, starting at 0.',
'ForLoop':'Runs a range of numbered actions in the same update.',
'Repeat':'Sends a command repeatedly; the first comes after the interval.',
'WaitForCondition':'Waits for a condition to become true, then continues once.',
'IdleLoop':'Sends a command on each update with no voices in this play.',
'Counter':'Counts commands and signals when the count equals its limit.',
'StopInstance':'Requests a normal stop of this play, including On Stop.',
'EndEvent':'Ends immediately, cuts audio, and skips On Stop.',
'Not':'Reverses true and false.',
'And':'True only if both inputs are true.',
'Or':'True if at least one input is true.',
'Xor':'True if exactly one input is true.',
'Passthrough':'Forwards a command unchanged, with no delay.'}
assert len(short)==49 and set(short)=={n['operation'] for n in catalogue}
printed=[]
def group(cat,y,rowheight=29):
    info=bycat[cat]
    box(40,y,515,27,SAND,5);box(49,y+7,12,12,info['color'],2)
    text(cat+' / '+info['colorName'],70,y+5,11,INK,'Bold')
    y+=34
    for n in catalogue:
        if colors['nodes'][n['operation']]!=cat:continue
        printed.append(n['operation'])
        title=escape(n['title'])
        para(f'<link href="{URL}graph/{n["family"]}/#{n["anchor"]}"><b>{title}</b></link>',49,y,189,9.6)
        h=para(escape(short[n['operation']]),244,y,302,9.6)
        c.setStrokeColor(HexColor('#E4E5D8'));c.line(49,H-y-rowheight+5,546,H-y-rowheight+5)
        y+=max(rowheight,h+9)
    return y+13

page(3,'03 / Node list','Start, choose, play.','All 49 nodes are listed on pages 3-5. The colored bar at the top of a node shows its category. Click a node name here for its full reference.')
y=158
for cat in ['Events','Sources','Playback','Parameters','Random']: y=group(cat,y,25)
assert y<778,y
finish()
page(4,'04 / Node list','Shape the values.','Green nodes provide numbers, convert them, or compare them. Connect their outputs to controls such as Volume and Playback Speed.')
y=group('Values',155,31)
assert y<735,y
box(40,728,515,44,SAND)
para('<b>Two kinds of connection:</b> a value tells a node what to use; a command tells it when to act. A Wave Asset alone cannot play a sound.',53,737,488,9.5)
finish()
page(5,'05 / Node list','Choose what happens.','Orange nodes control commands and conditions. A condition is a true/false value, such as whether the player is ready.')
y=group('Logic',155,28)
assert y<738,y
box(40,733,515,42,SAND)
para('<b>Sequence does not wait.</b> To play one sound after another, connect the first Play Audio node\'s <b>Finished</b> output to the next node\'s <b>Play</b> input.',53,741,488,9.5)
assert len(printed)==49 and len(set(printed))==49
finish()

page(6,'06 / Demo guide','Ten little experiments.','Open Getting Started > Explore & author, choose a demo, then Open demo. Press Play and use its on-screen controls. Click a demo name below for details.')
demo_text=[
('Hear ignition, a crackling loop, and an ending cue.','Learn: one handle, looping audio, and a graceful stop.'),
('Walk on grass, stone, and wood with varied footfalls.','Learn: surface parameters and single-step clip trimming.'),
('Release a bee and hear it move around the player.','Learn: following a moving object with 3D sound.'),
('Drive a car and change its engine tone as it works harder.','Learn: layered loops, RPM/load parameters, and signals.'),
('Blend rain and wind; hear thunder after a lightning strike.','Learn: live layers, delay, and positioned sound.'),
('Switch hammer, saw, and drill; add taps while working.','Learn: ordered commands, tool choice, and signals.'),
('Trigger a crowd of competing arcade sounds.','Learn: playback limits, cooldowns, and request results.'),
('Choose music and hear one track fade into the next.','Learn: allowed clips, overlapping plays, gain, and pause.'),
('Cross between worlds and listen to what stays or stops.','Learn: following, ownership, and owner-loss behavior.'),
('Prepare a launch, run a countdown, abort, or lift off.','Learn: conditions, sequencing, signals, and moving audio.')]
demos=json.loads((ROOT/'content-data/demos.json').read_text())
for i,(d,(desc,learn)) in enumerate(zip(demos,demo_text)):
    x=40+(i%2)*265;y=156+(i//2)*114
    box(x,y,250,102,SAND)
    para(f'<link href="{URL}demos/{d["slug"]}/"><b>{d["number"]} / {d["name"]}</b></link>',x+13,y+10,224,12)
    para(desc,x+13,y+33,224,9.7)
    para(learn,x+13,y+66,224,9,MUTED)
link('Full instructions, code examples, graph screenshots, and API reference', '',40,744,size=10)
text('Quick guide / September 2026 / Setup checked against Unity 6000.6.0f1',40,765,8,MUTED)
finish()
c.save()
print(OUT)
