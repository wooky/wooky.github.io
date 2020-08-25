import javax.swing.*;
import java.awt.*;
import java.awt.geom.*;
import java.awt.event.*;
import java.text.DecimalFormat;
import java.util.*;

public class CharlesLaw extends JApplet{
	private static final int W_WIDTH = 640;
	private static final int W_HEIGHT = 480;

	public void init(){
		//Set up a panel
		this.setSize(W_WIDTH,W_HEIGHT);
		
		//Add some imgs and such
		this.add(new doSomethingUseful());
		
		//Do something repeatedly!
		new java.util.Timer().scheduleAtFixedRate(new heyThereChalie(this),0,20);
		
		//Finally, show up
		this.setVisible(true);
	}

	class heyThereChalie extends TimerTask{
		JApplet j;
		
		public heyThereChalie(JApplet j){
			this.j = j;
		}
		public void run(){
			j.repaint();
		}
	}

	class doSomethingUseful extends JComponent{
		Graphics2D g2;

		int posStart = -1;
		int posEnd = -1;
		int posOrig = -1;
		int dirMoved = 0;
		
		Rectangle2D.Float[] mvRect;
		boolean moved = false;
		
		Rectangle2D.Float[] cont = new Rectangle2D.Float[3];
		Rectangle2D.Float botLine;
		
		Point[] ballPos;
		int[] ballDir;
		int[] ballSpeed;
		int[] ballSpeedIncDec;
		int dOfBalls = 20;
		
		Rectangle2D tempPlace;
		int extraSpeed = 0;
		
		public doSomethingUseful(){
			this.addMouseListener(new MouseAdapter(){
				public void mousePressed(MouseEvent e){
					if(tempPlace.contains(e.getPoint())){
						posOrig = (int)tempPlace.getY();
						posStart = e.getY();
						posEnd = posStart;
						moved = true;
					}
				}
				
				public void mouseReleased(MouseEvent e){
					if(posStart == -1)
						return;
					
					//Clear
					posStart = -1;
					posEnd = -1;
					posOrig = -1;
					dirMoved = 0;
				}
			});
			
			this.addMouseMotionListener(new MouseMotionAdapter(){
				public void mouseDragged(MouseEvent e){
					if(posStart == -1)
						return;
					if(e.getY() < posEnd){
						dirMoved = -1;
					}else if(e.getY() > posEnd){
						dirMoved = 1;
					}
					posEnd = e.getY();
					int diff = (int)(posOrig+posEnd-posStart);
					int bottom = (int)(botLine.getY()+dOfBalls);
					if(diff < mvRect[0].getHeight()) {
						diff = (int)mvRect[0].getHeight();
					} else if(diff > bottom-tempPlace.getHeight()) {
						diff = (int)(bottom-tempPlace.getHeight());
					}
					//mvRect = gimmePiston(diff);
					tempPlace = temperatureGauge(diff);
					mvRect = gimmePiston(diff-50);
					extraSpeed = (int)(cont[1].getY()+cont[1].getHeight()+75-tempPlace.getY()-140)/70;
					repaint();
				}
			});
		}

		public void paint(Graphics g){
			g2 = (Graphics2D)g;
			g2.setRenderingHint(
				RenderingHints.KEY_ANTIALIASING,
				RenderingHints.VALUE_ANTIALIAS_ON);
			
			//Give me a rectangle
			if(mvRect == null)
				mvRect = gimmePiston(225);
			g2.setColor(Color.GRAY);
			for(Shape g1 : mvRect)
				g2.fill(g1);
			
			//g2.setFont(new Font("Times New Roman",Font.BOLD,36));
			//g2.drawString(Double.toString(mvRect[0].getY()),570,25);

			int rx = (int)mvRect[1].getX();
			int l1x = (int)mvRect[1].getWidth();
			int botBord = W_HEIGHT-125;
			cont[0] = new Rectangle2D.Float(rx-1,30,dOfBalls,botBord-rx+30);
			cont[1] = new Rectangle2D.Float(l1x+rx,30,dOfBalls,botBord-rx+30);
			botLine = new Rectangle2D.Float(rx-1,botBord,l1x+dOfBalls+1,dOfBalls);
			cont[2] = botLine;
			for(Shape l : cont)
				g2.fill(l);
			
			g2.setColor(Color.DARK_GRAY);
			g2.fill(new Rectangle2D.Float(W_WIDTH-100,(int)mvRect[0].getHeight(),25,(int)cont[1].getHeight()+dOfBalls-30));
			if(tempPlace == null)
				tempPlace = temperatureGauge(250);
			g2.setColor(Color.GRAY);
			g2.fill(tempPlace);
			
			String[] hints = new String[4];
			hints[0] = Double.toString(cont[1].getY()+cont[1].getHeight()+75-tempPlace.getY());
			double quotient = Double.valueOf(hints[0])/5;
			hints[1] = Double.toString(Double.valueOf(new DecimalFormat("#.###").format(quotient)));
			
			g2.setFont(new Font("Times New Roman",Font.BOLD,36));
			g2.drawString(hints[0],(float)cont[0].getX(),W_HEIGHT-80);
			g2.drawString(hints[1],W_WIDTH/2,W_HEIGHT-80);
			g2.drawString(Character.toString((char)247),(float)(cont[0].getX()+50+W_WIDTH/2)/2,W_HEIGHT-80);
			g2.drawString("=      5",W_WIDTH/2+150,W_HEIGHT-80);
			
			String up = Character.toString((char)8593);
			String down = Character.toString((char)8595);
			if(dirMoved == -1){
				hints[2] = up;
				hints[3] = up;
			}else if(dirMoved == 1){
				hints[2] = down;
				hints[3] = down;
			}else{
				hints[2] = "Temperature";
				hints[3] = "Volume";
			}
			g2.drawString(hints[2],(float)cont[0].getX(),W_HEIGHT-80+36);
			g2.drawString(hints[3],W_WIDTH/2,W_HEIGHT-80+36);

			
			int[] xAxis = new int[2];
			
			redBalls();
			g2.setColor(Color.RED);
			for(int i=0;i<ballPos.length;i++){
				if(ballSpeed[i] >= 9)
					ballSpeed[i] = 1;
				else
					ballSpeed[i]++;
				g2.fill(new Ellipse2D.Float((int)ballPos[i].getX(),(int)ballPos[i].getY(),dOfBalls,dOfBalls));
			}
			
			if(moved == false){
				g2.setFont(new Font("Times New Roman",Font.PLAIN,18));
				g2.setColor(Color.GRAY);
				g2.drawString("Drag the gauge up"+(char)8594,(int)(tempPlace.getX()-160),
					(int)(tempPlace.getY()+18));
				g2.drawString("and down",(int)tempPlace.getX()-160,(int)tempPlace.getY()+36);
				/*g2.drawString("(but not too fast)",(int)tempPlace.getX()-200,
					(int)tempPlace.getY()+18);*/
			}
		}
		
		public Rectangle2D.Float[] gimmePiston(int y){
			int p_width = 25;
			int p_height = 50;
			int s_width = 50;
			int s_height = 30;
		
			Rectangle2D.Float[] s = new Rectangle2D.Float[2];
			s[0] = new Rectangle2D.Float(200,y,p_width,p_height);
			s[1] = new Rectangle2D.Float(50,y+s_height,300,s_height);
			return s;
		}
		
		public void redBalls(){
			int nOfBalls = 50;
		
			if(ballPos == null){
				ballPos = new Point[nOfBalls];
				ballSpeed = new int[nOfBalls];
				ballSpeedIncDec = new int[nOfBalls];
				ballDir = new int[nOfBalls];
				for(int i=0; i<nOfBalls; i++){
					double pistonBotX = mvRect[1].getY() + mvRect[1].getHeight();
					int myX = (int)(Math.random()*(botLine.getY()-pistonBotX-2*dOfBalls)+pistonBotX+dOfBalls);
					ballPos[i] = new Point((int)(Math.random()*(mvRect[1].getWidth()-2*dOfBalls)+mvRect[1].getX()+dOfBalls),myX);
					ballSpeed[i] = (int)(Math.random()*10+1);
					double backForth = Math.random();
					if(backForth < 0.5)
						ballSpeedIncDec[i] = -1;
					else
						ballSpeedIncDec[i] = 1;
					ballDir[i] = (int)(Math.random()*4);
				}
			}else{
				for(int i=0;i<nOfBalls;i++){
					//BALLDIR is defined with the following sketch
					//		0		 3
					//		 \		/
					//		 /		\
					//		1		 2
					int r;
					int d;
					
					//Check if we need to change the direction of the balls
					//(in other words, awful collission [sic?] detection)
					int swapMethod = 0;
					//if(ballPos[i].getY() <= mvRect[1].getY()+mvRect[1].getHeight())
					if(mvRect[1].contains(ballPos[i])){											//PISTON
						ballPos[i] = new Point((int)ballPos[i].getX(),(int)(mvRect[1].getY()+mvRect[1].getHeight()+1));
						swapMethod = 1;
					}else if(cont[0].contains(ballPos[i])){										//LEFT SIDE OF CONTAINER
						ballPos[i] = new Point((int)(cont[0].getX()+cont[0].getWidth()),(int)ballPos[i].getY());
						swapMethod = 2;
					}else if(cont[1].contains(ballPos[i].getX()+dOfBalls,ballPos[i].getY())){	//RIGHT SIDE OF CONTAINER
						ballPos[i] = new Point((int)cont[1].getX()-dOfBalls,(int)ballPos[i].getY());
						swapMethod = 3;
					}else if(cont[2].contains(ballPos[i].getX(),ballPos[i].getY()+dOfBalls)){	//BOTTOM OF CONTAINER
						ballPos[i] = new Point((int)ballPos[i].getX(),(int)cont[2].getY()-dOfBalls);
						swapMethod = 4;
					}
					///
					if(swapMethod == 1 || swapMethod == 4){
						if(ballDir[i] % 2 == 0)
							ballDir[i]++;
						else
							ballDir[i]--;
					}else if(swapMethod == 2 || swapMethod == 3){
						if(ballDir[i] % 2 == 0)
							ballDir[i]--;
						else
							ballDir[i]++;
					}
					///
					if(ballDir[i] == 4)
						ballDir[i] = 0;
					else if(ballDir[i] == -1)
						ballDir[i] = 3;
					
					//Test for which direction does the ball go
					switch(ballDir[i]){
						case 0:
							r = -1; d = -1;
							break;
						case 1:
							r = -1; d = 1;
							break;
						case 2:
							r = 1; d = 1;
							break;
						default:
							r = 1; d = -1;
							break;
					}
					ballPos[i] = new Point((int)ballPos[i].getX()+r*ballSpeed[i]+r*extraSpeed,
						(int)ballPos[i].getY()+d*ballSpeed[i]+d*extraSpeed);
				}
			}
		}
		
		private Rectangle2D temperatureGauge(int y){
			return new Rectangle2D.Float(W_WIDTH-100,y,25,75);
		}
	}
}
