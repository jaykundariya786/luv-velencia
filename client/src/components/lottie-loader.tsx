
import Lottie from 'lottie-react';

interface LottieLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Simple loading animation data (you can replace this with your own Lottie JSON)
const loadingAnimation = {
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 200,
  "h": 200,
  "nm": "Loading",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Circle",
      "sr": 1,
      "ks": {
        "o": {"a": 0, "k": 100},
        "r": {
          "a": 1,
          "k": [
            {"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [0]},
            {"t": 60, "s": [360]}
          ]
        },
        "p": {"a": 0, "k": [100, 100, 0]},
        "a": {"a": 0, "k": [0, 0, 0]},
        "s": {"a": 0, "k": [100, 100, 100]}
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "el",
              "s": {"a": 0, "k": [60, 60]},
              "p": {"a": 0, "k": [0, 0]},
              "nm": "Ellipse Path 1",
              "mn": "ADBE Vector Shape - Ellipse"
            },
            {
              "ty": "st",
              "c": {"a": 0, "k": [0.196, 0.435, 0.282, 1]},
              "o": {"a": 0, "k": 100},
              "w": {"a": 0, "k": 4},
              "lc": 1,
              "lj": 1,
              "ml": 4,
              "bm": 0,
              "d": [{"n": "d", "nm": "dash", "v": {"a": 0, "k": 15}}, {"n": "g", "nm": "gap", "v": {"a": 0, "k": 15}}],
              "nm": "Stroke 1",
              "mn": "ADBE Vector Graphic - Stroke"
            },
            {
              "ty": "tr",
              "p": {"a": 0, "k": [0, 0], "ix": 2},
              "a": {"a": 0, "k": [0, 0], "ix": 1},
              "s": {"a": 0, "k": [100, 100], "ix": 3},
              "r": {"a": 0, "k": 0, "ix": 6},
              "o": {"a": 0, "k": 100, "ix": 7},
              "sk": {"a": 0, "k": 0, "ix": 4},
              "sa": {"a": 0, "k": 0, "ix": 5},
              "nm": "Transform"
            }
          ],
          "nm": "Ellipse 1",
          "np": 3,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group"
        }
      ],
      "ip": 0,
      "op": 60,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
};

export default function LottieLoader({ size = 'md', className = '' }: LottieLoaderProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={sizeClasses[size]}>
        <Lottie 
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
}
