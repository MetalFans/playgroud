import java.util.Arrays;

public class Knight {
//	走過或不能走的路的標記
	static int[] flag = {-1,-1};
//	步數
	static int count = 0;
//	棋盤大小
	static int number=8;
//	路線
	static int[][] chain = new int[number*number][2];
//	起始點
	static int[] loc = {5,5};

//	向量相加，用來計算下一步
	public static int[] addVector(int[] a,int[] b){
		int[] add = new int[a.length];
		for(int i=0;i<a.length;i++){
			add[i] = a[i]+b[i];
		}
		if(add[0]<1||add[0]>number||add[1]<1||add[1]>number){
			add=Arrays.copyOf(flag, flag.length);
		}
		return add;
	}

//	算出下一步的所有可能性
	public static int[][] nextPath(int[] loc,int[][] dir){
		int[][] path= new int[dir.length][loc.length];
		for(int i=0;i<dir.length;i++){
			if(check(chain,loc,dir[i])){
				path[i]=addVector(loc,dir[i]);
			}else{
				path[i]=Arrays.copyOf(flag, flag.length);
			}
		}
		return path;
	}

//	檢查是否重複
	public static boolean check(int[][] chain,int[] loc,int[] dir){
		boolean c = false;
		for(int i=0;i<count;i++){
				if(Arrays.equals(chain[i],addVector(loc,dir))){
					c = false;
					break;
				}else{
					c =true;
				}
		}
		return c;	
	}
	
	public static void main(String[] args) {		
		chain[0]=Arrays.copyOf(loc,loc.length);
		boolean failed=false;
//		路線樹狀圖存成三維陣列
		int[][][] pathdata = new int[number*number][8][2];
		for(int i=1;i<chain.length;i++){
			chain[i]=Arrays.copyOf(flag, flag.length);
		}
		int[][] dir = { 
						{-2, 1},
						{ 2, 1},
						{ 2,-1},
						{-1,-2},
						{-2,-1},
						{-1, 2},
						{ 1, 2},
						{ 1,-2}
								};		
		int ni=0;
		keepgoing:
		while(count<number*number-1){
			count+=1;
			System.out.println("Step="+count);
			pathdata[count]=Arrays.copyOf(nextPath(loc,dir), nextPath(loc,dir).length);
//				不能走的路跳過
				keeptrying:
				while(Arrays.equals(pathdata[count][ni],flag)){
					ni+=1;
//					這層的路線都試過就往上退一層
					if(ni>=8){
						ni=0;
						count-=1;
						System.out.println("Step="+count);
//						退到不能退代表無解
						if(count==0){
							System.out.println("無解");
							failed=true;
							break keepgoing;
						}
//						退了之後重新進入keeptrying迴圈選擇路線
						continue keeptrying;
					}
				}
//				選好了就走進去
				loc = Arrays.copyOf(pathdata[count][ni],pathdata[count][ni].length);
//				走進去的地方做好標記
				pathdata[count][ni]=Arrays.copyOf(flag,flag.length);
				chain[count]=Arrays.copyOf(loc, loc.length);
				ni=0;
		}
//		若有解就印出結果
		if(!failed){
			int[][] game=new int[number][number];
			int step=0;	
			for(int i=0;i<chain.length;i++){
				step+=1;
				game[number-chain[i][0]][chain[i][1]-1]=step;
			}
			for(int i=0;i<number;i++){
				for(int j=0;j<number;j++){
					if(game[i][j]<10){
						System.out.print("  "+game[i][j]);
					}else{
						System.out.print(" "+game[i][j]);
					}
				}
				System.out.println();
			}
		}
	}
}