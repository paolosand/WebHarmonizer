import librosa
import numpy as np


def estimate_pitch(segment, sr, fmin=50.0, fmax=2000.0):
    """Estimate pitch of a given audio

    - Note that this function assumes that the segment only contains one note
    
    Parameters
    ----------
    segment : audio file to analyze
    sr : sample rate
    fmin : minimum frequency
    fmax : maximum frequency

    Returns
    -------
    note_midi : corresponding pitch as midi note
    """
    # Compute autocorrelation of input segment.

    # YOUR CODE GOES HERE
    r = librosa.autocorrelate(segment)

    # Define lower and upper limits for the autocorrelation argmax.

    # YOUR CODE GOES HERE
    # midi_hi = 120.0
    # midi_lo = 12.0
    # f_hi = librosa.midi_to_hz(midi_hi)
    # f_lo = librosa.midi_to_hz(midi_lo)
    t_lo = sr/fmax
    t_hi = sr/fmin


    r[:int(t_lo)] = 0
    r[int(t_hi):] = 0

    # Find the location of the maximum autocorrelation.

    # YOUR CODE GOES HERE
    t_max = r.argmax() # get maximum autocorrelation
    note_midi = round(librosa.hz_to_midi(float(float(sr)/t_max))) # get note in midi

    return note_midi


def generate_sine(f0, sr, n_duration):
    """ Generate a sine tone
    Parameters
    ----------
    f0 : frequency in hertz
    sr : sample rate
    n_duration : duration of the note in number of samples

    Returns
    -------
    tone : np.ndarray [shape=(length,), dtype=float64] Synthesized pure sine tone signal

    """
    tone = librosa.tone(frequency=f0, sr=sr, length=n_duration)
    
    return tone


def synthesize_melody(x, sr):
    """Estimate pitch and synthesize input melody with sine waves

    Parameters
    ----------
    x : input audio as a numpy array
    sr : sample rate

    Returns
    -------
    tones : synthesized audio as a numpy array
    """
    
    # Step 1: get note bounds
    hop_length = 100
    onset_samples = librosa.onset.onset_detect(y=x,
                                            sr=sr, units='samples',
                                            hop_length=hop_length,
                                            backtrack=False,
                                            pre_max=20,
                                            post_max=20,
                                            pre_avg=100,
                                            post_avg=100,
                                            delta=0.2,
                                            wait=0)
    onset_boundaries = np.concatenate([[0], onset_samples, [len(x)]])

    padding = 250 # padding between notes in num of samples
    tones = np.array([])

    for i in range(len(onset_boundaries)-1):
        bounds = [onset_boundaries[i], onset_boundaries[i+1]-padding]
        
        segment = x[bounds[0]:bounds[1]]

        # Step 2: estimate pitch
        midi_note = estimate_pitch(segment=segment, sr=sr)
        hz_note = librosa.midi_to_hz(midi_note)

        # Step 3: generate sine tone
        n_duration = bounds[1] - bounds[0]
        tone = generate_sine(f0=hz_note, sr=sr, n_duration=n_duration)

        tones = np.append(tones, tone)

    return tones